// ==================== GLOBAL HELPERS ====================
window.showLoginModal = function() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    window.location.href = 'auth.html?redirect=' + encodeURIComponent(currentPath);
};

window.hideLoginModal = function() {
    // No longer used with redirect approach
};

// ==================== RENDER FUNCTIONS ====================
const renderService = (s) => `
    <div class="marketplace-card" onclick="window.location.href='service-details.html?id=${s.id}'">
        <div class="m-card-inner">
            <div class="m-card-front">
                <div class="m-card-image">
                    <div class="m-card-heart"><i class="far fa-heart"></i></div>
                    <img src="${s.image || s.icon || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}" alt="${s.title}">
                </div>
                <div class="m-card-body">
                    <div class="m-card-title">${s.title}</div>
                    <div class="m-card-rating">
                        <i class="fas fa-star"></i> ${s.rating || '5.0'} <span>(${s.reviews || '0'})</span>
                    </div>
                    <div class="m-card-footer">
                        <div class="m-price-label">Starting at</div>
                        <div class="m-price-value">$${s.price || '99'}</div>
                    </div>
                </div>
            </div>
            <div class="m-card-back">
                <div class="m-back-content">
                    <h3>${s.title}</h3>
                    <p>${s.description ? (s.description.substring(0, 150) + '...') : 'Click to see full details about this professional service and how we can help your business grow.'}</p>
                    <div class="m-back-footer">
                        <span class="btn btn-primary btn-sm">View Details</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

window.renderTeam = (m, index) => {
    const isMain = index === 0;
    const name = m.display_name || m.username;

    // Build Social Links for Card from DB
    let socialHtml = '';
    if (m.linkedin) socialHtml += `<a href="${m.linkedin}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-linkedin"></i></a>`;
    if (m.github) socialHtml += `<a href="${m.github}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>`;
    if (m.twitter) socialHtml += `<a href="${m.twitter}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-twitter"></i></a>`;

    // Fallback if no links in DB
    if (!socialHtml) {
        socialHtml = `<span style="font-size:0.8rem; color:var(--text-muted)">Staff Member</span>`;
    }

    return `
    <div class="team-member ${isMain ? 'team-member-main' : 'team-member-small'}" onclick="window.location.href='team-details.html?id=${m.id}'" style="cursor:pointer">
        <div class="member-image">
            ${m.image ? `<img src="${m.image}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-circle"></i>`}
        </div>
        <div class="member-content">
            <div class="member-tag">${m.role || 'Expert'}</div>
            <h3>${name}</h3>
            <p class="member-bio">${m.bio ? (m.bio.substring(0, 100) + '...') : 'Dedicated professional at Az Meer Limited.'}</p>
            <div class="member-social">
                ${socialHtml}
            </div>
        </div>
    </div>`;
};

const renderBlog = (b) => `
    <article class="blog-card" onclick="window.location.href='blog-post.html?id=${b.id}'" style="cursor:pointer">
        <div class="blog-image">
            <img src="${b.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}" alt="${b.title}" style="width:100%; height:200px; object-fit:cover; border-radius:12px 12px 0 0;">
        </div>
        <div class="blog-content-wrapper" style="padding:25px;">
            <div class="blog-meta" style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">
                <span><i class="far fa-calendar"></i> ${new Date(b.created_at || Date.now()).toLocaleDateString()}</span>
                ${b.author ? `<span style="margin-left:15px"><i class="far fa-user"></i> ${b.author}</span>` : ''}
            </div>
            <h3 class="blog-title" style="font-size:1.25rem; margin-bottom:15px; color:var(--text-main);">${b.title}</h3>
            <p class="blog-summary" style="font-size:0.95rem; color:var(--text-muted); line-height:1.6; margin-bottom:20px;">${b.summary || ''}</p>
            <span class="blog-link" style="color:var(--primary-color); font-weight:700; font-size:0.9rem;">Read Full Story <i class="fas fa-arrow-right"></i></span>
        </div>
    </article>`;

const renderPortfolio = (p) => `
    <div class="portfolio-card" onclick="window.location.href='portfolio-details.html?id=${p.id}'">
        <div class="p-card-image">
            <img src="${p.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}" alt="${p.title}">
            <div class="p-category-tag">${p.category || 'Digital Solution'}</div>
            <div class="p-overlay">
                <div class="p-overlay-content">
                    <span class="btn btn-white btn-sm" style="font-weight:700">View Project</span>
                </div>
            </div>
        </div>
        <div class="p-card-body">
            <h4 class="p-title">${p.title}</h4>
            <p class="p-desc">${p.description ? p.description : 'Technical excellence and creative design.'}</p>
        </div>
    </div>`;

const renderFaq = (f) => `
    <details class="faq-card">
        <summary class="faq-question">
            <span>${f.question}</span>
            <div class="faq-icon"><i class="fas fa-plus"></i></div>
        </summary>
        <div class="faq-answer">
            <p>${f.answer}</p>
        </div>
    </details>`;

// ==================== CORE LOADING LOGIC ====================
async function fetchContent(type, containerId, renderFn, limit = 0) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Use limit from data attribute if available and not passed as argument
    if (limit === 0 && container.dataset.limit) {
        limit = parseInt(container.dataset.limit);
    }

    // Get URL parameters for filtering
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');

    try {
        let url = `api/content.php?type=${type}`;
        if (limit > 0) url += `&limit=${limit}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (jsonErr) {
            console.error("Invalid JSON from API:", text);
            throw new Error("Invalid server response");
        }

        // Always clear loader on successful parse
        container.innerHTML = '';

        if (data.ok && data[type] && Array.isArray(data[type]) && data[type].length > 0) {
            let items = data[type];

            // Apply category filter if present
            if (categoryFilter && (type === 'services' || type === 'top_services' || type === 'blogs')) {
                items = items.filter(s => s.category && s.category.toLowerCase() === categoryFilter.toLowerCase());
            }

            if (items.length > 0) {
                items.forEach((item, index) => {
                    try {
                        const html = renderFn(item, index);
                        if (html) {
                            const wrapper = document.createElement('div');
                            wrapper.innerHTML = html.trim();
                            container.appendChild(wrapper.firstElementChild);
                        }
                    } catch (renderError) {
                        console.error(`Error rendering ${type} item:`, renderError, item);
                    }
                });
            } else {
                container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 4rem;">No items found in category "${categoryFilter}".</div>`;
            }

            // Extract categories for sidebars
            if (type === 'services') {
                updateSidebars(data[type], 'services.html');
            } else if (type === 'blogs') {
                updateSidebars(data[type], 'blogs.html', 'blogSidebar');
            }
        } else {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 4rem;">No ${type.replace(/_/g, ' ')} found.</div>`;
        }
    } catch (e) {
        console.error(`Could not load ${type}:`, e);
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 4rem;">
            <i class="fas fa-exclamation-circle fa-2x" style="margin-bottom:10px; color: var(--danger-color)"></i>
            <p>Failed to load ${type.replace(/_/g, ' ')}.</p>
            <button onclick="location.reload()" class="btn btn-sm btn-secondary" style="margin-top:15px">Retry</button>
        </div>`;
    }
}

function updateSidebars(items, pageName, sidebarId = null) {
    let sidebars;
    if (sidebarId) {
        const sb = document.getElementById(sidebarId);
        sidebars = sb ? [sb] : [];
    } else {
        sidebars = document.querySelectorAll('.m-sidebar');
    }

    if (sidebars.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const activeCat = urlParams.get('category');

    const iconMap = {
        'Web': 'fa-code',
        'Mobile': 'fa-mobile-alt',
        'Design': 'fa-paint-brush',
        'Marketing': 'fa-bullhorn',
        'Writing': 'fa-file-alt',
        'Tech': 'fa-microchip',
        'Tutorial': 'fa-graduation-cap',
        'News': 'fa-newspaper',
        'default': 'fa-chevron-right'
    };

    const categories = [...new Set(items.map(s => s.category).filter(Boolean))];
    const categoryHtml = categories.map(cat => {
        const icon = iconMap[cat] || iconMap['default'];
        const isActive = activeCat && activeCat.toLowerCase() === cat.toLowerCase() ? 'active' : '';
        return `
            <a href="${pageName}?category=${encodeURIComponent(cat)}" class="m-side-link ${isActive}">
                <i class="fas ${icon}"></i> ${cat}
            </a>
        `;
    }).join('');

    sidebars.forEach(sidebar => {
        const header = `<span class="m-sidebar-label">Categories</span>`;
        const allActive = !activeCat ? 'active' : '';
        const labelText = sidebarId === 'blogSidebar' ? 'All Stories' : 'All Services';
        const defaultLink = `<a href="${pageName}" class="m-side-link ${allActive}"><i class="fas fa-th-large"></i> ${labelText}</a>`;
        sidebar.innerHTML = header + defaultLink + categoryHtml;
    });
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    fetchContent('services', 'servicesGrid', renderService);
    fetchContent('top_services', 'topMarketplaceGrid', renderService);
    fetchContent('portfolio', 'portfolioGrid', renderPortfolio);
    fetchContent('team', 'teamGrid', renderTeam);
    fetchContent('blogs', 'blogsGrid', renderBlog);
    fetchContent('faqs', 'faqList', renderFaq);

    updateLoginButton();

    // Service/Blog Search Handler
    const searchHandler = (inputId, gridId, cardClass) => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                const cards = document.querySelectorAll(`.${cardClass}`);
                let foundCount = 0;

                cards.forEach(card => {
                    const text = card.innerText.toLowerCase();
                    if (text.includes(term)) {
                        card.style.display = 'block';
                        foundCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                const grid = document.getElementById(gridId);
                if (grid) {
                    let noRes = grid.querySelector('.search-no-results');
                    if (foundCount === 0 && term !== '') {
                        if (!noRes) {
                            grid.insertAdjacentHTML('beforeend', `<div class="search-no-results" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                                <i class="fas fa-search-minus fa-3x" style="margin-bottom:15px; opacity:0.5;"></i>
                                <p>No items match "${term}"</p>
                            </div>`);
                        }
                    } else if (noRes) {
                        noRes.remove();
                    }
                }
            });
        }
    };

    searchHandler('serviceSearch', 'servicesGrid', 'marketplace-card');
    searchHandler('serviceSearch', 'topMarketplaceGrid', 'marketplace-card');
    searchHandler('blogSearch', 'blogsGrid', 'blog-card');
    searchHandler('faqSearch', 'faqList', 'faq-card');

    // Letter Drop Animation for Hero
    const companyName = document.querySelector('.hero-company-name');
    if (companyName) {
        const line1 = "Az Meer";
        const line2 = "(SMC-Private) Limited";
        companyName.innerHTML = '';

        const createLine = (text, className, delayOffset) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = className;
            lineDiv.style.display = 'flex';
            lineDiv.style.justifyContent = 'center';
            lineDiv.style.flexWrap = 'wrap';
            [...text].forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.className = 'drop-letter';
                span.style.animationDelay = `${delayOffset + (i * 0.05)}s`;
                lineDiv.appendChild(span);
            });
            return lineDiv;
        };

        companyName.appendChild(createLine(line1, 'name-line-1', 0));
        companyName.appendChild(createLine(line2, 'name-line-2 highlight', 0.5));
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const heroBottom = document.getElementById('heroBottomContent');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Navbar toggle
        if (scrollPos > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hero bottom content reveal on scroll
        if (heroBottom) {
            if (scrollPos > 100) {
                heroBottom.classList.add('visible');
            } else {
                heroBottom.classList.remove('visible');
            }
        }
    });

    // Hero Mouse Move Effect
    const hero = document.querySelector('.hero');
    const blobs = document.querySelectorAll('.blob');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 30;
            const y = (clientY / window.innerHeight - 0.5) * 30;

            blobs.forEach((blob, index) => {
                const factor = (index + 1) * 0.5;
                blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginPopupForm');
    const closeLoginBtn = document.getElementById('closeLogin');
    const loginBackdrop = document.querySelector('.login-backdrop');

    if (closeLoginBtn) closeLoginBtn.onclick = hideLoginModal;
    if (loginBackdrop) loginBackdrop.onclick = hideLoginModal;

    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const user = document.getElementById('popupUsername').value;
            const pass = document.getElementById('popupPassword').value;
            const msg = document.getElementById('popupLoginMessage');

            try {
                const res = await fetch('api/auth.php?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user, password: pass })
                });
                const data = await res.json();
                if (data.ok) {
                    window.location.reload();
                } else {
                    msg.textContent = data.message || 'Login failed';
                }
            } catch (err) {
                msg.textContent = 'Error connecting to server';
            }
        };
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            setTimeout(() => {
                alert('Thank you! Your message has been sent.');
                contactForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        };
    }

    initLiveChat();

    // 6. Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.onclick = () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        };
    }

    // Dropdown toggle on mobile
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.onclick = (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                const parent = toggle.closest('.dropdown');
                parent.classList.toggle('active');
            }
        };
    });
});

// ==================== LIVE CHAT LOGIC ====================
let activeChatId = null;
let chatPolling = null;

let initializingChat = null;
async function ensureChatInitialized(details = null) {
    if (activeChatId && !details) return true;
    if (initializingChat && !details) return initializingChat;

    initializingChat = (async () => {
        try {
            const res = await fetch('api/live_chat.php?action=init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details || {})
            });

            if (!res.ok) {
                const text = await res.text();
                let errMsg = "Server responded with " + res.status;
                try {
                    const data = JSON.parse(text);
                    if (data.message) errMsg = data.message;
                } catch(e) {}
                console.error("Chat init failed:", text);
                throw new Error(errMsg);
            }

            const data = await res.json();
            if (data.ok) {
                activeChatId = data.chatId;
                // If it was a pre-chat form, switch view
                const preForm = document.getElementById('preChatForm');
                const chatMain = document.getElementById('chatMainArea');
                if (preForm && chatMain) {
                    preForm.classList.add('hidden');
                    chatMain.classList.remove('hidden');
                }
                return true;
            }
            throw new Error(data.message || "Unknown init error");
        } catch (e) {
            console.error("Chat init failed:", e);
            return false;
        } finally {
            initializingChat = null;
        }
    })();

    return initializingChat;
}

async function initLiveChat() {
    const form = document.getElementById('liveChatForm');
    if (!form) return;

    // Check if user is logged in
    try {
        const authRes = await fetch('api/auth.php?action=check');
        const auth = await authRes.json();
        const isLogged = auth.ok && auth.authenticated;

        if (isLogged) {
            // Logged in: auto-init
            ensureChatInitialized().then(success => {
                if (success) fetchLiveMessages();
            });
        }
    } catch (e) {
        console.error("Chat auth check failed", e);
    }

    form.onsubmit = async (e) => {
        e.preventDefault();
        const input = document.getElementById('liveInput');
        const msg = input.value.trim();
        if (!msg) return;

        // Try to initialize if not already
        const initialized = await ensureChatInitialized();
        if (!initialized) {
            alert("Connection error. Please refresh the page. (Chat could not be initialized)");
            return;
        }

        const originalMsg = msg;
        input.value = '';

        // Local feedback
        renderMessage(msg, 'sent', 'Sending...');

        try {
            const res = await fetch('api/live_chat.php?action=send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId: activeChatId, message: msg })
            });

            if (!res.ok) {
                const text = await res.text();
                let errMsg = "Server error";
                try {
                    const data = JSON.parse(text);
                    if (data.message) errMsg = data.message;
                } catch(e) {}
                throw new Error(errMsg);
            }

            const data = await res.json();
            if (data.ok) {
                fetchLiveMessages(true);
            } else {
                throw new Error(data.message || "Failed to send");
            }
        } catch (e) {
            alert("Connection error: " + e.message + ". Please refresh the page.");
            input.value = originalMsg;
            // Remove the "Sending..." message
            const msgs = document.getElementById('liveMessages').querySelectorAll('.msg.sent');
            if (msgs.length > 0) msgs[msgs.length - 1].remove();
        }
    };
}

window.toggleLiveChat = async function() {
    const win = document.getElementById('chatWindow');
    if (!win) return;

    const isOpening = !win.classList.contains('active');
    if (isOpening) {
        try {
            const authRes = await fetch('api/auth.php?action=check');
            const auth = await authRes.json();
            if (!auth.ok || !auth.authenticated) {
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                window.location.href = 'auth.html?redirect=' + encodeURIComponent(currentPath);
                return;
            }
        } catch (e) {
            window.location.href = 'auth.html';
            return;
        }
    }

    const isActive = win.classList.toggle('active');
    if (isActive) {
        ensureChatInitialized().then(() => fetchLiveMessages());
        if (!chatPolling) chatPolling = setInterval(fetchLiveMessages, 4000);
        setTimeout(() => document.getElementById('liveInput')?.focus(), 400);
    } else {
        if (chatPolling) clearInterval(chatPolling);
        chatPolling = null;
    }
};

async function fetchLiveMessages(forceRefresh = false) {
    if (!activeChatId) return;
    try {
        const res = await fetch(`api/live_chat.php?action=fetch&chatId=${activeChatId}`);
        const data = await res.json();
        if (data.ok) {
            const container = document.getElementById('liveMessages');
            if (!container) return;

            // Only refresh if count changed or forced
            const currentMsgs = container.querySelectorAll('.msg:not(.received:first-child)');
            if (forceRefresh || data.messages.length !== currentMsgs.length) {
                const welcomeMsg = container.querySelector('.received:first-child');
                const welcomeHTML = (welcomeMsg && welcomeMsg.textContent.includes('Welcome')) ? welcomeMsg.outerHTML : '';

                container.innerHTML = welcomeHTML;
                data.messages.forEach(m => {
                    const type = m.is_staff ? 'received' : 'sent';
                    renderMessage(m.message, type, m.created_at, m.is_staff ? m.sender_name : null, m.image_path);
                });
                container.scrollTop = container.scrollHeight;
            }
        }
    } catch (e) {}
}

function renderMessage(text, type, time = 'Just now', sender = null, imagePath = null) {
    const container = document.getElementById('liveMessages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `msg ${type}`;

    let contentHtml = text;
    if (imagePath) {
        contentHtml = `<a href="${imagePath}" target="_blank"><img src="${imagePath}" style="max-width:100%; border-radius:8px; display:block; margin-bottom:5px;"></a><small>${text}</small>`;
    } else if (text && text.startsWith('[IMAGE]')) {
        const path = text.replace('[IMAGE]', '');
        contentHtml = `<a href="${path}" target="_blank"><img src="${path}" style="max-width:100%; border-radius:8px; display:block;"></a>`;
    }

    div.innerHTML = `
        <div class="msg-content">
            ${sender ? `<span style="display:block; font-size:11px; font-weight:800; margin-bottom:4px; color:#2563eb">${sender}</span>` : ''}
            ${contentHtml}
        </div>
        <div class="msg-time">${time}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ==================== AUTH UI ====================
async function updateLoginButton() {
    const loginBtn = document.getElementById('openLogin');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileLink = document.getElementById('auth-nav-item');
    if (!loginBtn) return;

    try {
        const res = await fetch('api/auth.php?action=check');
        const data = await res.json();
        if (data.ok && data.authenticated) {
            // Logged In State
            loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-flex';
            if (profileLink) {
                profileLink.style.display = 'block';
                const link = profileLink.querySelector('a');
                if (link) {
                    if (['admin', 'owner', 'manager', 'freelancer'].includes(data.user.role)) {
                        link.href = 'dashboard.php';
                        link.textContent = 'Dashboard';
                    } else {
                        link.href = 'profile.html';
                        link.textContent = 'My Account';
                    }
                }
            }
        } else {
            // Logged Out State
            loginBtn.style.display = 'inline-flex';
            loginBtn.innerHTML = `Login`;
            loginBtn.onclick = () => showLoginModal();
            loginBtn.className = "btn btn-secondary btn-sm";
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (profileLink) profileLink.style.display = 'none';
        }
    } catch (e) {}
}

async function handleLogout() {
    await fetch('api/auth.php?action=logout');
    window.location.reload();
}
window.handleLogout = handleLogout;

window.switchContactTab = function(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.contact-tab-content').forEach(c => c.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.toLowerCase().includes(tabName));
    if (activeBtn) activeBtn.classList.add('active');
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) activeContent.classList.add('active');
};

window.handleOrder = async function(id) {
    try {
        const res = await fetch('api/auth.php?action=check');
        const data = await res.json();
        if (data.ok && data.authenticated) {
            window.location.href = `checkout.html?service_id=${id}`;
        } else {
            showLoginModal();
        }
    } catch (e) {
        window.location.href = 'auth.html';
    }
};
