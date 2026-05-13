/**
 * Enhanced Client Dashboard Logic
 */

let currentClient = null;
let allOrders = [];
let activeProjectId = null;
let projectChatPolling = null;

async function checkAuth() {
    try {
        const res = await fetch('api/auth.php?action=check');
        const auth = await res.json();
        if (!auth.authenticated) {
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `auth.html?redirect=${currentUrl}`;
            return false;
        }
        currentClient = auth.user;
        document.getElementById('welcomeName').textContent = `Welcome, ${auth.user.username}`;
        document.getElementById('accName').value = auth.user.username;
        document.getElementById('accEmail').value = auth.user.email || 'No email set';

        await loadDashboardData();
        return true;
    } catch (e) {
        console.error("Auth check failed", e);
    }
}

function switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const section = document.getElementById(`section-${viewName}`);
    if (section) section.classList.add('active');

    const nav = document.querySelector(`[data-view="${viewName}"]`);
    if (nav) nav.classList.add('active');

    document.getElementById('viewTitle').textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);

    // Fix: Reset scroll position when switching views
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTop = 0;

    if (viewName === 'chat') loadProjectChatThreads();
    if (viewName === 'account') loadFullProfile();
}

async function loadFullProfile() {
    try {
        const res = await fetch(`api/content.php?type=users`);
        const data = await res.json();
        const me = (data.users || []).find(u => String(u.id) === String(currentClient.id));

        if (me) {
            document.getElementById('accUsername').value = me.username || '';
            document.getElementById('accName').value = me.display_name || '';
            document.getElementById('accEmail').value = me.email || '';
            document.getElementById('accImage').value = me.image || '';
            document.getElementById('accBio').value = me.bio || '';
            document.getElementById('accAbout').value = me.about || '';
            document.getElementById('accLinkedin').value = me.linkedin || '';
            document.getElementById('accGithub').value = me.github || '';
            document.getElementById('accTwitter').value = me.twitter || '';

            if (['freelancer', 'admin', 'owner'].includes(me.role)) {
                document.getElementById('staffOnlyFields').style.display = 'block';
                document.getElementById('accSkills').value = me.skills || '';
                document.getElementById('accEducation').value = me.education || '';
            }
        }
    } catch (e) {}
}

async function loadDashboardData() {
    try {
        const res = await fetch('api/orders.php?action=my_orders');
        const data = await res.json();
        allOrders = data.orders || [];

        // Stats
        const active = allOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
        const done = allOrders.filter(o => o.status === 'completed').length;
        const spent = allOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);

        document.getElementById('stat-active').textContent = active;
        document.getElementById('stat-done').textContent = done;
        document.getElementById('stat-spent').textContent = `$${spent.toFixed(2)}`;

        renderOrders('ordersTable'); // Small table for overview
        renderOrders('fullOrdersTable'); // Full table for history view
        renderFreelancers();
        renderReviews();
        renderInvoices();
    } catch (e) {
        console.error("Error loading dashboard data", e);
    }
}

function renderOrders(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (allOrders.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#64748b;">You haven\'t placed any orders yet.</p>';
        return;
    }

    let html = `<table style="width:100%; border-collapse:collapse; min-width:600px;">
        <thead style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
            <tr style="text-align:left">
                <th style="padding:15px">ID</th>
                <th>Service & Milestone</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead><tbody>`;

    allOrders.forEach(o => {
        const statusColor = o.status === 'completed' ? '#10b981' : (o.status === 'pending' ? '#f59e0b' : '#3b82f6');

        // Milestone logic
        const steps = ['Plan', 'Design', 'Dev', 'Test', 'Live'];
        let currentStepIdx = 0;
        if (o.status === 'completed') currentStepIdx = 4;
        else if (o.status === 'accepted') currentStepIdx = 2;
        else if (o.status === 'testing') currentStepIdx = 3;

        html += `<tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:15px">#${o.id}</td>
            <td>
                <strong>${o.service_title}</strong>
                <div class="milestone-track">
                    ${steps.map((s, i) => `
                        <div class="milestone-step ${i <= currentStepIdx ? (i === currentStepIdx ? 'active' : 'completed') : ''}">
                            <div class="milestone-dot"></div>
                            <span class="milestone-label">${s}</span>
                        </div>
                    `).join('')}
                </div>
            </td>
            <td>$${o.price}</td>
            <td><span style="background:${statusColor}15; color:${statusColor}; padding:4px 10px; border-radius:100px; font-size:0.8rem; font-weight:700;">${o.status.toUpperCase()}</span></td>
            <td>
                <button onclick="openEditModal(${o.id})" class="btn btn-secondary btn-sm" style="padding:5px 10px;"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="startProjectChat(${o.id})" class="btn btn-primary btn-sm" style="padding:5px 10px;"><i class="fas fa-comments"></i> Chat</button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function renderReviews() {
    const container = document.getElementById('reviewProjectsList');
    if (!container) return;
    const completed = allOrders.filter(o => o.status === 'completed');

    if (completed.length === 0) {
        container.innerHTML = '<p style="color:#64748b">No completed projects yet. You can leave reviews once a project is finished.</p>';
        return;
    }

    container.innerHTML = completed.map(o => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; background:#f8fafc; border-radius:12px; margin-bottom:10px;">
            <span><strong>${o.service_title}</strong> (#${o.id})</span>
            <button class="btn btn-primary btn-sm" onclick="alert('Review system for #${o.id} is coming soon!')">Rate Service</button>
        </div>
    `).join('');
}

function renderInvoices() {
    const container = document.getElementById('invoiceTableBody');
    if (!container) return;

    if (allOrders.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="padding:20px; text-align:center; color:#64748b;">No billing history found.</td></tr>';
        return;
    }

    container.innerHTML = allOrders.map(o => `
        <tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:15px">INV-${o.id}${new Date(o.created_at).getFullYear()}</td>
            <td>${o.service_title}</td>
            <td>${new Date(o.created_at).toLocaleDateString()}</td>
            <td><strong>$${o.price}</strong></td>
            <td><button class="btn btn-secondary btn-sm" onclick="alert('Downloading Invoice...')"><i class="fas fa-download"></i></button></td>
        </tr>
    `).join('');
}

function renderFreelancers() {
    const grid = document.getElementById('freelancerGrid');
    const freelancers = allOrders.filter(o => o.assigned_to).map(o => ({
        id: o.assigned_to,
        username: o.freelancer_name,
        email: o.freelancer_email,
        role: o.freelancer_role,
        projectName: o.service_title
    }));

    // Remove duplicates
    const unique = Array.from(new Set(freelancers.map(f => f.id)))
        .map(id => freelancers.find(f => f.id === id));

    if (unique.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:#64748b;">No freelancers assigned to your projects yet.</div>';
        return;
    }

    grid.innerHTML = '';
    unique.forEach(f => {
        const div = document.createElement('div');
        div.className = 'card';
        div.style.textAlign = 'center';
        div.innerHTML = `
            <div style="width:70px; height:70px; background:var(--primary); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px; font-size:1.5rem;">
                <i class="fas fa-user"></i>
            </div>
            <h4 style="margin:0;">${f.username}</h4>
            <p style="font-size:0.85rem; color:var(--primary); font-weight:700; margin:5px 0;">${f.role}</p>
            <p style="font-size:0.8rem; color:var(--text-muted);">Working on: ${f.projectName}</p>
            <button onclick="switchView('chat')" class="btn btn-secondary btn-sm" style="margin-top:15px; width:100%;">Message</button>
        `;
        grid.appendChild(div);
    });
}

// --- PROJECT EDIT ---
window.openEditModal = function(id) {
    const order = allOrders.find(o => o.id == id);
    if (!order) return;

    document.getElementById('editOrderId').value = id;
    document.getElementById('editOrderDesc').value = order.project_description || '';
    const modal = document.getElementById('editOrderModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden';
};

window.closeEditModal = function() {
    const modal = document.getElementById('editOrderModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
};

document.getElementById('editOrderForm').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('editOrderId').value;
    const desc = document.getElementById('editOrderDesc').value;
    const msg = document.getElementById('editOrderMsg');

    msg.textContent = "Updating...";
    try {
        const res = await fetch('api/orders.php?action=update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: id, description: desc })
        });
        const data = await res.json();
        if (data.ok) {
            msg.style.color = '#10b981';
            msg.textContent = data.message;
            loadDashboardData();
            setTimeout(closeEditModal, 1500);
        } else {
            msg.style.color = '#ef4444';
            msg.textContent = data.message;
        }
    } catch (err) { msg.textContent = "Error updating order."; }
};

// --- PROFILE UPDATE ---
document.getElementById('accountForm').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById('profileMsg');

    const profileData = {
        id: currentClient.id,
        display_name: document.getElementById('accName').value,
        image: document.getElementById('accImage').value,
        bio: document.getElementById('accBio').value,
        about: document.getElementById('accAbout').value,
        linkedin: document.getElementById('accLinkedin').value,
        github: document.getElementById('accGithub').value,
        twitter: document.getElementById('accTwitter').value
    };

    if (document.getElementById('staffOnlyFields').style.display === 'block') {
        profileData.skills = document.getElementById('accSkills').value;
        profileData.education = document.getElementById('accEducation').value;
    }

    msg.textContent = "Saving changes...";
    msg.style.color = "var(--primary-color)";

    try {
        const res = await fetch('api/admin.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                action: 'save',
                type: 'users',
                data: profileData
            })
        });
        const data = await res.json();
        if (data.ok) {
            msg.style.color = '#10b981';
            msg.textContent = "Profile updated successfully!";
            document.getElementById('welcomeName').textContent = `Welcome, ${profileData.display_name || currentClient.username}`;
        } else {
            msg.style.color = '#ef4444';
            msg.textContent = data.message || "Update failed.";
        }
    } catch (err) { msg.textContent = "Error updating profile."; }
};

// --- PROJECT CHAT ---
async function loadProjectChatThreads() {
    const threadList = document.getElementById('chatThreads');
    if (allOrders.length === 0) {
        threadList.innerHTML = '<div style="padding:20px; text-align:center; color:#999;">No active projects</div>';
        return;
    }

    threadList.innerHTML = '';
    allOrders.forEach(o => {
        const div = document.createElement('div');
        div.className = 'nav-item' + (activeProjectId === o.id ? ' active' : '');
        div.style.padding = '15px 20px';
        div.innerHTML = `
            <div>
                <div style="font-weight:700; font-size:0.9rem;">#${o.id} - ${o.service_title}</div>
                <div style="font-size:0.75rem; color:#64748b;">${o.status.toUpperCase()}</div>
            </div>
        `;
        div.onclick = () => startProjectChat(o.id);
        threadList.appendChild(div);
    });
}

window.startProjectChat = async function(orderId) {
    activeProjectId = orderId;
    switchView('chat');

    const order = allOrders.find(o => o.id == orderId);
    if (!order) return;
    document.getElementById('activeChatHeader').textContent = `Chat: ${order.service_title} (#${orderId})`;

    try {
        const res = await fetch('api/live_chat.php?action=init', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ orderId: orderId })
        });
        const data = await res.json();
        if (data.ok) {
            activeChatId = data.chatId; // from main.js global scope
            fetchProjectMessages();
            if (projectChatPolling) clearInterval(projectChatPolling);
            projectChatPolling = setInterval(fetchProjectMessages, 4000);
        }
    } catch (e) { console.error("Chat init failed", e); }
};

async function fetchProjectMessages() {
    if (!activeChatId) return;
    try {
        const res = await fetch(`api/live_chat.php?action=fetch&chatId=${activeChatId}`);
        const data = await res.json();
        if (data.ok) {
            const container = document.getElementById('msgList');
            container.innerHTML = '';
            data.messages.forEach(m => {
                const isMe = String(m.sender_id) === String(currentClient.id);
                const div = document.createElement('div');
                div.className = `msg ${isMe ? 'sent' : 'received'}`;

                let contentHtml = `<div class="msg-content">${m.message}</div>`;

                // Handle Images
                if (m.image_path) {
                    contentHtml = `
                        <div class="msg-content">
                            <a href="${m.image_path}" target="_blank">
                                <img src="${m.image_path}" style="max-width: 200px; border-radius: 10px; cursor: pointer; display: block; margin-bottom: 5px;">
                            </a>
                            <small>${m.message}</small>
                        </div>`;
                } else if (m.message && m.message.startsWith('[IMAGE]')) {
                    const path = m.message.replace('[IMAGE]', '');
                    contentHtml = `
                        <div class="msg-content">
                            <a href="${path}" target="_blank">
                                <img src="${path}" style="max-width: 200px; border-radius: 10px; cursor: pointer; display: block; margin-bottom: 5px;">
                            </a>
                        </div>`;
                }

                div.innerHTML = `
                    ${contentHtml}
                    <div style="font-size:0.7rem; opacity:0.7; margin-top:4px;">${m.created_at}</div>
                `;
                container.appendChild(div);
            });
            container.scrollTop = container.scrollHeight;
        }
    } catch (e) {}
}

document.getElementById('receiptUpload').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChatId) return;

    const formData = new FormData();
    formData.append('action', 'upload');
    formData.append('chatId', activeChatId);
    formData.append('receipt', file);

    try {
        const res = await fetch('api/live_chat.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.ok) {
            fetchProjectMessages();
        } else {
            alert(data.message || "Upload failed");
        }
    } catch (err) {
        console.error("Upload error", err);
        alert("Error uploading file.");
    }
    e.target.value = ''; // Reset
};

document.getElementById('chatForm').onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg || !activeChatId) return;

    const originalMsg = msg;
    input.value = '';
    try {
        const res = await fetch('api/live_chat.php?action=send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ chatId: activeChatId, message: msg })
        });
        const data = await res.json();
        if (data.ok) fetchProjectMessages();
        else {
            input.value = originalMsg;
            alert(data.message);
        }
    } catch (e) { input.value = originalMsg; }
};

// Event Listeners for Nav
document.querySelectorAll('.sidebar .nav-item').forEach(item => {
    item.onclick = () => {
        switchView(item.dataset.view);
        if (window.innerWidth <= 991) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    };
});

const sidebarToggle = document.getElementById('sidebarToggle');
if (sidebarToggle) {
    sidebarToggle.onclick = () => {
        document.querySelector('.sidebar').classList.toggle('active');
    };
}

document.getElementById('logoutBtn').onclick = async () => {
    await fetch('api/auth.php?action=logout');
    window.location.href = 'index.html';
};

// Start
checkAuth().then((success) => {
    if (!success) return;

    // Handle URL parameters for navigation
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const hash = window.location.hash;

    if (hash === '#section-chat' || params.get('view') === 'chat') {
        if (orderId) {
            startProjectChat(orderId);
        } else {
            switchView('chat');
        }
    } else if (hash) {
        const view = hash.replace('#section-', '');
        switchView(view);
    }
});
