/**
 * Az Meer Staff Engine - Unified for Owner, Admin, Manager
 */

const CONFIG = {
    services: { title: 'Services', table: 'services', fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'text', placeholder: 'Web, Mobile, Design, Marketing...' },
        { name: 'price', label: 'Price ($)', type: 'number' },
        { name: 'rating', label: 'Rating (0-5)', type: 'number' },
        { name: 'reviews', label: 'Review Count', type: 'number' },
        { name: 'image', label: 'Main Image URL', type: 'text' },
        { name: 'gallery', label: 'Gallery (Comma-separated URLs)', type: 'text' },
        { name: 'video_url', label: 'Video URL (YouTube/Direct)', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea', full: true }
    ]},
    portfolio: { title: 'Portfolio', table: 'portfolio', fields: [
        { name: 'title', label: 'Project Name', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'image', label: 'Image URL', type: 'text' },
        { name: 'link', label: 'External Project Link', type: 'text' },
        { name: 'client', label: 'Client Name', type: 'text' },
        { name: 'duration', label: 'Project Duration', type: 'text' },
        { name: 'technologies', label: 'Technologies Used', type: 'text' },
        { name: 'team_size', label: 'Team Size', type: 'text' },
        { name: 'description', label: 'Short Summary (Card)', type: 'textarea', full: true },
        { name: 'overview', label: 'Project Overview (Details Page)', type: 'textarea', full: true },
        { name: 'features', label: 'Key Features (One per line)', type: 'textarea', full: true },
        { name: 'results', label: 'Results & Impact (One per line)', type: 'textarea', full: true }
    ]},
    top_services: { title: 'Top Services', table: 'top_services', fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'rating', label: 'Rating (0-5)', type: 'number' },
        { name: 'reviews', label: 'Review Count', type: 'number' },
        { name: 'icon', label: 'Main Image URL', type: 'text' },
        { name: 'gallery', label: 'Gallery (Comma-separated URLs)', type: 'text' },
        { name: 'video_url', label: 'Video URL (YouTube/Direct)', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea', full: true }
    ]},
    team: { title: 'Team', table: 'team', fields: [
        { name: 'username', label: 'Name', type: 'text', required: true },
        { name: 'role', label: 'Role', type: 'text' },
        { name: 'sort_order', label: 'Priority (Lower = First)', type: 'number' },
        { name: 'image', label: 'Image URL', type: 'text' },
        { name: 'bio', label: 'Bio', type: 'textarea', full: true }
    ]},
    blogs: { title: 'Blogs', table: 'blogs', fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'text', placeholder: 'Tech, News, Tutorial...' },
        { name: 'author', label: 'Author', type: 'text' },
        { name: 'image', label: 'Feature Image URL', type: 'text' },
        { name: 'summary', label: 'Short Summary (Card)', type: 'textarea', full: true },
        { name: 'content', label: 'Blog Content (HTML/CSS Allowed)', type: 'textarea', full: true }
    ]},
    users: { title: 'User Accounts', table: 'users', fields: [
        { name: 'username', label: 'Login Username', type: 'text', required: true },
        { name: 'display_name', label: 'Public Display Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'role', label: 'Role', type: 'text', placeholder: 'user, freelancer, manager, admin, owner' },
        { name: 'status', label: 'Status', type: 'text', placeholder: 'active, pending, rejected' },
        { name: 'image', label: 'Profile Image URL', type: 'text' },
        { name: 'bio', label: 'Short Bio', type: 'text' },
        { name: 'about', label: 'Detailed About', type: 'textarea', full: true },
        { name: 'linkedin', label: 'LinkedIn', type: 'text' },
        { name: 'github', label: 'GitHub', type: 'text' },
        { name: 'twitter', label: 'Twitter', type: 'text' },
        { name: 'skills', label: 'Technical Skills', type: 'text' },
        { name: 'education', label: 'Education', type: 'text' }
    ]},
    orders: { title: 'Orders/Leads', table: 'orders', fields: [
        { name: 'status', label: 'Status', type: 'text' },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'project_description', label: 'Details', type: 'textarea', full: true }
    ]},
    settings: { title: 'Site Settings', isKV: true, fields: [
        { name: 'site_name', label: 'Site Name', type: 'text' },
        { name: 'hero_title', label: 'Hero Title', type: 'text' },
        { name: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
        { name: 'contact_email', label: 'Official Contact Email', type: 'text' },
        { name: 'maintenance_mode', label: 'Maintenance Mode (on/off)', type: 'text', ownerOnly: true },
        { name: 'service_fee', label: 'Platform Service Fee (%)', type: 'number', ownerOnly: true },
        { name: 'primary_color', label: 'Primary Brand Color', type: 'color', ownerOnly: true },
        { name: 'api_secret_key', label: 'System API Secret (Sensitive)', type: 'password', ownerOnly: true }
    ]}
};

let currentView = 'dashboard';
let currentData = [];
let activeItem = null;
let currentUser = null;
let freelancersList = [];

const dom = {
    navItems: document.querySelectorAll('.nav-item'),
    viewTitle: document.getElementById('viewTitle'),
    itemList: document.getElementById('itemList'),
    formContent: document.getElementById('formContent'),
    dynamicForm: document.getElementById('dynamicForm'),
    addNewBtn: document.getElementById('addNewBtn'),
    deleteBtn: document.getElementById('deleteBtn'),
    loginOverlay: document.getElementById('loginOverlay'),
    toast: document.getElementById('adminToast'),
    logoutBtn: document.getElementById('logoutBtn')
};

// Bind navigation items immediately
function bindNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.onclick = (e) => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            if (window.switchView) window.switchView(item.dataset.view);
        };
    });
}

// Global SwitchView for overrides
window.switchView = function(view) {
    currentView = view;
    if (dom.viewTitle) {
        dom.viewTitle.textContent = CONFIG[view]?.title ||
            (view === 'live-chat' ? 'Live Chat Support' :
            (view === 'moderation' ? 'Account Moderation' :
            (view === 'promotions' ? 'Role Management' : 'Dashboard')));
    }

    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));

    if (view === 'dashboard') {
        const dashboard = document.getElementById('view-dashboard');
        if (dashboard) dashboard.classList.remove('hidden');
        loadStats();
    } else if (view === 'live-chat') {
        const chatView = document.getElementById('view-live-chat');
        if (chatView) chatView.classList.remove('hidden');
        initStaffChat();
    } else if (view === 'moderation') {
        const modView = document.getElementById('view-moderation');
        if (modView) modView.classList.remove('hidden');
        loadModerationQueue();
    } else if (view === 'promotions') {
        // Handled by owner.html override usually, but safe fallback
        const promView = document.getElementById('view-promotions');
        if (promView) promView.classList.remove('hidden');
    } else {
        const crudView = document.getElementById('view-crud');
        if (crudView) crudView.classList.remove('hidden');
        renderForm();
        fetchData();
    }
};

async function init() {
    bindNav();

    try {
        const res = await fetch('api/auth.php?action=check');
        const auth = await res.json();

        // Auth Check
        if (!auth.authenticated || !['owner', 'admin', 'manager', 'freelancer'].includes(auth.user.role)) {
            if (dom.loginOverlay) dom.loginOverlay.classList.remove('hidden');
            else window.location.href = 'auth.html';
            return;
        }

        currentUser = auth.user;
        console.log("Logged in as:", currentUser.role);

        // Pre-load freelancers for assignment tools
        if (['admin', 'owner'].includes(currentUser.role)) {
            loadFreelancersList();
        }

        // Initial View
        const urlParams = new URLSearchParams(window.location.search);
        const viewParam = urlParams.get('view');
        window.switchView(viewParam || 'dashboard');

        if (dom.logoutBtn) dom.logoutBtn.onclick = async () => {
            await fetch('api/auth.php?action=logout');
            location.href = 'index.html';
        };
    } catch(e) {
        console.error("Init failed", e);
    }
}

async function loadStats() {
    try {
        const res = await fetch('api/admin.php?action=stats');
        const data = await res.json();
        if (data.ok) {
            if (document.getElementById('stat-users')) document.getElementById('stat-users').textContent = data.stats.users;
            if (document.getElementById('stat-orders')) document.getElementById('stat-orders').textContent = data.stats.orders;
            if (document.getElementById('stat-services')) document.getElementById('stat-services').textContent = data.stats.services;

            // Owner specific stats
            if (document.getElementById('stat-revenue')) document.getElementById('stat-revenue').textContent = `$${data.stats.revenue}`;
            if (document.getElementById('stat-pending')) document.getElementById('stat-pending').textContent = data.stats.pending;
        }

        // Load Activity Log
        const logRes = await fetch('api/admin.php?action=activity_log');
        const logData = await logRes.json();
        const logBody = document.getElementById('activityLogBody');
        if (logBody && logData.ok) {
            if (logData.logs.length === 0) {
                logBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">No recent activity logs available.</td></tr>';
            } else {
                logBody.innerHTML = '';
                logData.logs.forEach(l => {
                    logBody.innerHTML += `
                        <tr>
                            <td>${new Date(l.time).toLocaleString()}</td>
                            <td>${l.user}</td>
                            <td>${l.action}</td>
                            <td><span style="color:${l.status === 'active' || l.status === 'accepted' ? '#10b981' : '#f59e0b'}">${l.status.toUpperCase()}</span></td>
                        </tr>
                    `;
                });
            }
        }
    } catch (e) {}
}

async function fetchData() {
    if (!dom.itemList) return;
    dom.itemList.innerHTML = '<div style="padding:20px">Loading...</div>';

    try {
        const res = await fetch(`api/content.php?type=${currentView}`);
        const data = await res.json();
        currentData = data[currentView] || data.settings || [];

        if (CONFIG[currentView].isKV) {
            const settingsMap = {};
            currentData.forEach(s => settingsMap[s.setting_key] = s.setting_value);
            renderForm(settingsMap);
        } else {
            // Update activeItem reference to the new data if it exists
            if (activeItem) {
                const updated = currentData.find(i => String(i.id) === String(activeItem.id));
                if (updated) activeItem = updated;
            }
            renderList();
            if (activeItem) renderForm(activeItem);
        }
    } catch (e) {
        dom.itemList.innerHTML = '<div style="padding:20px">Error loading data.</div>';
    }
}

function renderList() {
    if (!dom.itemList) return;
    dom.itemList.innerHTML = '';
    currentData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'data-row' + (activeItem?.id === item.id ? ' active' : '');

        // Specialized labels for different types
        let label = item.title || item.username || item.display_name || 'Item #'+item.id;
        let sub = item.category || item.role || item.status || '';

        if (currentView === 'orders') {
            label = item.service_name || 'Order #' + item.id;
            sub = (item.client_name ? item.client_name + ' | ' : '') + (item.status || 'pending').toUpperCase();
            if (['admin', 'owner'].includes(currentUser.role) && item.assigned_name) {
                sub += ` | Assigned: ${item.assigned_name}`;
            }
        }

        div.innerHTML = `<strong>${label}</strong><br><small>${sub}</small>`;
        div.onclick = () => { activeItem = item; renderList(); renderForm(item); };
        dom.itemList.appendChild(div);
    });
}

function renderForm(data = null) {
    const config = CONFIG[currentView];
    if (!config || !dom.formContent) return;

    dom.formContent.innerHTML = '';

    // Rank Check for User Management UI
    let canEdit = true;
    if (currentView === 'users' && data && data.id !== currentUser.id) {
        const rankMap = { 'owner': 10, 'admin': 5, 'manager': 3, 'freelancer': 2, 'user': 1 };
        const myRank = rankMap[currentUser.role] || 0;
        const targetRank = rankMap[data.role] || 0;

        if (myRank <= targetRank && currentUser.role !== 'owner') {
            canEdit = false;
            const warning = document.createElement('div');
            warning.className = 'full';
            warning.style.cssText = 'background:#fee2e2; color:#b91c1c; padding:15px; border-radius:8px; margin-bottom:20px; font-weight:600;';
            warning.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Access Denied: You cannot edit a user with ${targetRank >= myRank ? 'equal or higher' : 'this'} rank.`;
            dom.formContent.appendChild(warning);
        }
    }

    // Custom header and details for orders
    if (currentView === 'orders' && data) {
        const details = document.createElement('div');
        details.className = 'full';
        details.style.background = '#f8fafc';
        details.style.padding = '20px';
        details.style.borderRadius = '12px';
        details.style.marginBottom = '20px';
        details.style.border = '1px solid #e2e8f0';

        const statusColor = data.status === 'pending' ? '#f59e0b' : (data.status === 'accepted' ? '#10b981' : '#ef4444');

        details.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px;">
                <div>
                    <h3 style="margin:0; font-size: 1.4rem;">Order #${data.id}</h3>
                    <p style="margin:5px 0 0; color:#64748b;">Placed on: ${new Date(data.created_at).toLocaleString()}</p>
                </div>
                <div style="text-align: right;">
                    <span style="display:inline-block; padding: 5px 12px; border-radius: 20px; font-weight:700; font-size: 0.8rem; background:${statusColor}15; color:${statusColor}; border: 1px solid ${statusColor}30;">
                        ${(data.status || 'pending').toUpperCase()}
                    </span>
                    <p style="margin:5px 0 0; font-size:0.8rem; color:#64748b;">Assigned to: <strong>${data.assigned_name || 'Unassigned'}</strong></p>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <div>
                    <label style="display:block; color:#64748b; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 5px;">Client Information</label>
                    <p style="margin:0; font-weight: 600;">${data.client_name || 'Anonymous User'}</p>
                    <p style="margin:2px 0 0; font-size: 0.9rem; color:#64748b;">${data.client_email || 'No email provided'}</p>
                </div>
                <div>
                    <label style="display:block; color:#64748b; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 5px;">Service Requested</label>
                    <p style="margin:0; font-weight: 600;">${data.service_name || 'Custom Project'}</p>
                    <p style="margin:2px 0 0; font-size: 1.1rem; color:var(--primary-color); font-weight: 700;">$${data.price || '0.00'}</p>
                </div>
            </div>

            <div style="margin-top: 25px; display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap:10px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                ${['admin', 'owner'].includes(currentUser.role) ? `
                    <button type="button" class="btn btn-primary btn-sm" onclick="updateOrderStatus(${data.id}, 'accepted')">Accept</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="updateOrderStatus(${data.id}, 'rejected')">Reject</button>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="updateOrderStatus(${data.id}, 'pending')">Pending</button>
                    <button type="button" class="btn btn-success btn-sm" onclick="updateOrderStatus(${data.id}, 'completed')">Complete</button>
                ` : `
                    <button type="button" class="btn btn-primary btn-sm" onclick="updateOrderStatus(${data.id}, 'in-progress')">In Progress</button>
                    <button type="button" class="btn btn-success btn-sm" onclick="updateOrderStatus(${data.id}, 'completed')">Completed</button>
                `}
            </div>
        `;

        if (['admin', 'owner'].includes(currentUser.role)) {
            const assignBox = document.createElement('div');
            assignBox.style.marginTop = '20px';
            assignBox.style.paddingTop = '20px';
            assignBox.style.borderTop = '1px solid #e2e8f0';
            assignBox.innerHTML = `
                <label style="display:block; margin-bottom:10px; font-weight:600; font-size:0.9rem;">Assign Order to Specialist</label>
                <div style="display:flex; gap:10px;">
                    <select id="orderFreelancerSelect" style="flex:1; padding:10px; border-radius:8px; border:1px solid #ddd;"></select>
                    <button type="button" class="btn btn-primary btn-sm" onclick="assignOrder(${data.id})">Assign</button>
                </div>
            `;
            details.appendChild(assignBox);

            // Populate the dropdown after a tiny delay to ensure it exists
            setTimeout(() => {
                const sel = document.getElementById('orderFreelancerSelect');
                if (sel) {
                    sel.innerHTML = '<option value="">-- Unassigned --</option>';
                    freelancersList.forEach(f => {
                        sel.innerHTML += `<option value="${f.id}" ${String(f.id) === String(data.assigned_to) ? 'selected' : ''}>${f.username} (${f.role})</option>`;
                    });
                }
            }, 0);
        }

        dom.formContent.appendChild(details);
    }

    config.fields.forEach(f => {
        // Role-based visibility for settings
        if (f.ownerOnly && currentUser?.role !== 'owner') return;

        const div = document.createElement('div');
        div.className = 'form-group' + (f.full ? ' full' : '');
        div.innerHTML = `<label style="display:block;margin-bottom:5px;font-weight:600;">${f.label}</label>`;

        let input;
        if (f.type === 'textarea') {
            input = document.createElement('textarea');
            input.style.width = '100%';
            input.style.minHeight = '100px';
            input.style.padding = '10px';
            input.style.borderRadius = '8px';
            input.style.border = '1px solid #ddd';
        } else {
            input = document.createElement('input');
            input.type = f.type;
            input.style.width = '100%';
            input.style.padding = '10px';
            input.style.borderRadius = '8px';
            input.style.border = '1px solid #ddd';
        }

        input.name = f.name;
        input.value = data ? (data[f.name] || '') : '';

        // Role Restrictions
        if (currentView === 'users' && f.name === 'role' && currentUser?.role !== 'owner') {
            input.disabled = true;
        }

        if (input) input.disabled = !canEdit;

        div.appendChild(input);
        dom.formContent.appendChild(div);
    });

    if (dom.deleteBtn) dom.deleteBtn.classList.toggle('hidden', !data || config.isKV || !canEdit);

    const submitBtn = dom.dynamicForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = !canEdit;
}

if (dom.dynamicForm) dom.dynamicForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(dom.dynamicForm);
    const itemData = Object.fromEntries(formData.entries());
    const payload = CONFIG[currentView].isKV ?
        { action: 'save_settings', settings: itemData } :
        { action: 'save', type: currentView, data: { ...itemData, id: activeItem?.id } };

    try {
        const res = await fetch('api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.ok) {
            showToast("Saved Successfully!");
            fetchData();
            if (!activeItem) activeItem = { id: result.id };
        } else {
            alert(result.message || "Save failed");
        }
    } catch (e) { alert("Server error"); }
};

if (dom.deleteBtn) dom.deleteBtn.onclick = async () => {
    if (!activeItem || !confirm("Are you sure you want to delete this?")) return;
    try {
        const res = await fetch('api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', type: currentView, id: activeItem.id })
        });
        const result = await res.json();
        if (result.ok) {
            activeItem = null;
            fetchData();
            showToast("Deleted!");
        }
    } catch (e) { alert("Delete failed"); }
};

if (dom.addNewBtn) dom.addNewBtn.onclick = () => { activeItem = null; renderList(); renderForm(); };

function showToast(m) {
    if (!dom.toast) return;
    dom.toast.textContent = m;
    dom.toast.classList.add('show');
    setTimeout(() => dom.toast.classList.remove('show'), 3000);
}

// ==================== LIVE CHAT STAFF LOGIC ====================
let activeStaffChatId = null;
let staffChatPolling = null;

async function initStaffChat() {
    await fetchStaffChats();
    loadFreelancersList();

    // If we already have an active chat, resume polling and refresh messages
    if (activeStaffChatId) {
        fetchStaffMessages();
        if (staffChatPolling) clearInterval(staffChatPolling);
        staffChatPolling = setInterval(fetchStaffMessages, 4000);
    }

    const form = document.getElementById('adminChatForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const input = document.getElementById('adminChatInput');
            const msg = input.value.trim();
            if (!msg) return;

            if (!activeStaffChatId) {
                alert("Please select a chat first.");
                return;
            }

            // Keep original message in case of failure
            input.value = '';
            try {
                const res = await fetch('api/live_chat.php?action=send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId: activeStaffChatId, message: msg })
                });
                const result = await res.json();
                if (result.ok) {
                    fetchStaffMessages();
                } else {
                    input.value = msg;
                    alert("Failed to send: " + (result.message || "Unknown error"));
                }
            } catch (e) {
                input.value = msg;
                alert("Network error while sending message");
            }
        };
    }
}

async function fetchStaffChats() {
    try {
        const res = await fetch('api/live_chat.php?action=list_staff');
        const data = await res.json();
        if (data.ok) {
            const list = document.getElementById('staffChatList');
            if (!list) return;
            list.innerHTML = '';
            data.chats.forEach(chat => {
                const div = document.createElement('div');
                div.className = 'data-row' + (activeStaffChatId === chat.id ? ' active' : '');
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${chat.guest_name}</strong>
                        <small style="color:var(--primary-color)">${chat.status}</small>
                    </div>
                    <small>${chat.freelancer_name ? 'Assigned: ' + chat.freelancer_name : 'Unassigned'}</small>
                `;
                div.onclick = () => openStaffChat(chat);
                list.appendChild(div);
            });

            const badge = document.getElementById('liveChatCount');
            if (badge) {
                const unassigned = data.chats.filter(c => !c.assigned_to).length;
                badge.textContent = unassigned;
                badge.style.display = unassigned > 0 ? 'inline-block' : 'none';
            }
        }
    } catch (e) {}
}

function openStaffChat(chat) {
    activeStaffChatId = chat.id;
    const info = document.getElementById('chatUserInfo');
    if (info) info.innerHTML = `<strong>${chat.guest_name}</strong> (${chat.guest_email || 'No email'})`;

    const tools = document.getElementById('assignTools');
    if (tools) {
        if (['admin', 'owner'].includes(currentUser.role)) {
            tools.classList.remove('hidden');
            const select = document.getElementById('staffFreelancerSelect');
            if (select) select.value = chat.assigned_to || '';
        } else if (currentUser.role === 'freelancer' && !chat.assigned_to) {
            // Freelancer can claim unassigned chats
            tools.innerHTML = `<button class="btn btn-primary btn-sm" onclick="claimChat(${chat.id})">Claim Chat</button>`;
            tools.classList.remove('hidden');
        } else {
            tools.classList.add('hidden');
        }
    }

    fetchStaffMessages();
    if (staffChatPolling) clearInterval(staffChatPolling);
    staffChatPolling = setInterval(fetchStaffMessages, 4000);
}

window.claimChat = async function(chatId) {
    try {
        const res = await fetch('api/live_chat.php?action=assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: chatId, freelancerId: currentUser.id })
        });
        const data = await res.json();
        if (data.ok) {
            showToast("Chat Claimed!");
            fetchStaffChats();
            // Re-render tools for current chat
            const chatObj = currentData.find(c => c.id === chatId);
            if (chatObj) {
                chatObj.assigned_to = currentUser.id;
                openStaffChat(chatObj);
            }
        }
    } catch (e) {
        showToast("Claim failed");
    }
};

async function fetchStaffMessages() {
    if (!activeStaffChatId) return;
    try {
        const res = await fetch(`api/live_chat.php?action=fetch&chatId=${activeStaffChatId}`);
        const data = await res.json();
        if (data.ok) {
            const container = document.getElementById('adminChatMessages');
            if (!container) return;
            container.innerHTML = '';
            data.messages.forEach(m => {
                const isMe = String(m.sender_id) === String(currentUser.id);
                const div = document.createElement('div');
                div.className = `msg ${isMe ? 'sent' : 'received'}`;
                div.innerHTML = `
                    <div class="msg-content">${m.sender_name && !isMe ? `<strong>${m.sender_name}:</strong> ` : ''}${m.message}</div>
                    <div class="msg-time">${m.created_at}</div>
                `;
                container.appendChild(div);
            });
            container.scrollTop = container.scrollHeight;
        }
    } catch (e) {}
}

async function loadFreelancersList() {
    try {
        const res = await fetch('api/content.php?type=users');
        const data = await res.json();
        // Filter for active staff/specialists only
        freelancersList = (data.users || []).filter(u =>
            ['freelancer', 'manager', 'admin', 'owner'].includes(u.role) &&
            (u.status === 'active' || !u.status)
        );

        const select = document.getElementById('staffFreelancerSelect');
        if (select) {
            select.innerHTML = '<option value="">Select Freelancer</option>';
            freelancersList.forEach(f => {
                select.innerHTML += `<option value="${f.id}">${f.username} (${f.role})</option>`;
            });
        }
    } catch (e) {}
}

window.assignOrder = async function(orderId) {
    const freelancerId = document.getElementById('orderFreelancerSelect')?.value;
    try {
        const res = await fetch('api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'assign_order', id: orderId, freelancer_id: freelancerId || null })
        });
        const data = await res.json();
        if (data.ok) {
            showToast("Order Assigned!");
            fetchData();
        } else {
            alert(data.message || "Assignment failed");
        }
    } catch (e) { alert("Server error"); }
};

window.assignActiveChat = async function() {
    const freelancerId = document.getElementById('staffFreelancerSelect').value;
    if (!activeStaffChatId || !freelancerId) return;
    try {
        const res = await fetch('api/live_chat.php?action=assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: activeStaffChatId, freelancerId: freelancerId })
        });
        const data = await res.json();
        if (data.ok) { showToast("Assigned!"); fetchStaffChats(); }
    } catch (e) {}
};

window.updateOrderStatus = async function(id, status) {
    if (!confirm(`Are you sure you want to mark this order as ${status}?`)) return;
    try {
        const res = await fetch('api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_order_status', id: id, status: status })
        });
        const data = await res.json();
        if (data.ok) {
            showToast(`Order ${status.toUpperCase()}!`);
            fetchData();
        } else {
            alert("Error: " + (data.message || "Failed to update status"));
        }
    } catch (e) {
        console.error(e);
        alert("Network error while updating order status.");
    }
};

async function loadModerationQueue() {
    const queue = document.getElementById('verificationQueue');
    if (!queue) return;
    queue.innerHTML = '<div style="padding:20px; text-align:center;">Checking for pending accounts...</div>';

    try {
        const res = await fetch('api/content.php?type=users&status=pending');
        const data = await res.json();
        const users = data.users || [];

        if (users.length === 0) {
            queue.innerHTML = '<p style="text-align:center; padding:40px; border:2px dashed #e2e8f0; border-radius:12px; color:#94a3b8;">Queue is currently empty. No pending verifications.</p>';
            return;
        }

        queue.innerHTML = '';
        users.forEach(u => {
            const div = document.createElement('div');
            div.style.cssText = 'background:#f8fafc; padding:20px; border-radius:12px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; border:1px solid #e2e8f0;';
            div.innerHTML = `
                <div>
                    <h4 style="margin:0;">${u.username}</h4>
                    <p style="margin:5px 0 0; color:#64748b; font-size:0.9rem;">${u.email} | Role: <strong>${u.role.toUpperCase()}</strong></p>
                    <small style="color:#94a3b8;">Registered: ${new Date(u.created_at).toLocaleDateString()}</small>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-primary btn-sm" onclick="verifyUser(${u.id}, 'active')">Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="verifyUser(${u.id}, 'rejected')">Reject</button>
                </div>
            `;
            queue.appendChild(div);
        });
    } catch (e) {
        queue.innerHTML = '<p style="text-align:center; color:#ef4444;">Error loading queue.</p>';
    }
}

window.verifyUser = async function(id, status) {
    if (!confirm(`Are you sure you want to ${status === 'active' ? 'approve' : 'reject'} this user?`)) return;
    try {
        const res = await fetch('api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'approve_user', id: id, status: status })
        });
        const data = await res.json();
        if (data.ok) {
            showToast(`User ${status === 'active' ? 'Approved' : 'Rejected'}!`);
            loadModerationQueue();
        }
    } catch (e) {
        alert("Action failed");
    }
};

init();
