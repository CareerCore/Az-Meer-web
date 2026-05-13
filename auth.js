(function () {
    const STORAGE_KEYS = {
        users: 'abh_users',
        services: 'abh_services',
        orders: 'abh_orders',
        session: 'abh_session'
    };

    const AUTH_API_URL = 'api/auth.php';
    let userCache = null;

    // --- MOCK DATABASE HELPER (For Testing without PHP) ---
    function getLocalDB(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }
    function saveLocalDB(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Initialize default admin if no users exist
    if (getLocalDB(STORAGE_KEYS.users).length === 0) {
        saveLocalDB(STORAGE_KEYS.users, [{
            username: 'Admin',
            email: 'admin@azmeer.com',
            password: 'admin123456', // In a real app we'd hash this
            role: 'admin',
            id: 1
        }]);
    }

    async function postAuth(action, payload) {
        try {
            const response = await fetch(AUTH_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: action, ...payload })
            });
            return await response.json();
        } catch (e) {
            console.warn("PHP Backend not found. Using Mock LocalStorage DB.");
            return handleMockAuth(action, payload);
        }
    }

    function handleMockAuth(action, payload) {
        const users = getLocalDB(STORAGE_KEYS.users);

        if (action === 'login') {
            const user = users.find(u => (u.email === payload.email || u.username === payload.email) && u.password === payload.password);
            if (user) return { ok: true, user: user };
            return { ok: false, message: 'Invalid credentials (Mock Mode)' };
        }

        if (action === 'signup') {
            if (users.find(u => u.email === payload.email)) return { ok: false, message: 'Email exists (Mock Mode)' };
            const newUser = { ...payload, id: Date.now(), role: 'user' };
            users.push(newUser);
            saveLocalDB(STORAGE_KEYS.users, users);
            return { ok: true, user: newUser };
        }
        return { ok: false, message: 'Action not supported in Mock Mode' };
    }

    async function register(username, password, profile) {
        if (!username || !password) {
            return { ok: false, reason: 'invalid', message: 'Username and password are required.' };
        }

        const result = await postAuth('register', {
            username: username,
            password: password,
            profile: profile || {}
        });
        if (result.ok && result.user) {
            userCache = result.user;
            setSession(result.user);
        }
        return result;
    }

    async function login(username, password) {
        const result = await postAuth('login', {
            username: username,
            password: password
        });
        if (result.ok && result.user) {
            userCache = result.user;
            setSession(result.user);
        }
        return result;
    }

    function setSession(user) {
        if (!user || !user.username) {
            return;
        }
        writeJson(STORAGE_KEYS.session, {
            username: user.username,
            profile: user.profile || {},
            at: new Date().toISOString()
        });
    }

    function getSession() {
        return readJson(STORAGE_KEYS.session, null);
    }

    async function syncSession() {
        try {
            const response = await fetch(`${AUTH_API_URL}?action=session`, {
                method: 'GET',
                cache: 'no-store'
            });
            const result = await response.json();
            if (result.ok && result.session && result.user) {
                userCache = result.user;
                setSession(result.user);
                return result.session;
            }
        } catch (error) {
            // Ignore sync failures and keep local fallback session.
        }
        return getSession();
    }

    async function getCurrentUser() {
        const session = getSession();
        if (session && session.username && userCache && userCache.username === session.username) {
            return userCache;
        }
        const synced = await syncSession();
        if (!synced || !synced.username) {
            return null;
        }
        return userCache;
    }

    async function logout() {
        try {
            await postAuth('logout', {});
        } catch (error) {
            // Local cleanup still happens even if server logout fails.
        }
        localStorage.removeItem(STORAGE_KEYS.session);
        userCache = null;
    }

    function getOrders() {
        return readJson(STORAGE_KEYS.orders, []);
    }

    function saveOrders(orders) {
        writeJson(STORAGE_KEYS.orders, orders);
    }

    function createOrder(order) {
        const orders = getOrders();
        orders.push(order);
        saveOrders(orders);
        return order;
    }

    function updateOrder(orderId, updater) {
        const orders = getOrders();
        const index = orders.findIndex(order => order.id === orderId);
        if (index === -1) {
            return null;
        }
        const updated = updater(orders[index]) || orders[index];
        orders[index] = updated;
        saveOrders(orders);
        return updated;
    }

    function getOrdersForUser(username) {
        return getOrders().filter(order => order.username === username);
    }

    async function initOrdersFromFile(url) {
        const existing = getOrders();
        if (existing.length) {
            return existing;
        }
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                return [];
            }
            saveOrders(data);
            return data;
        } catch (error) {
            return [];
        }
    }

    window.AbhAuth = {
        getUser: getUser,
        getCurrentUser: getCurrentUser,
        register: register,
        login: login,
        setSession: setSession,
        getSession: getSession,
        syncSession: syncSession,
        logout: logout,
        getOrders: getOrders,
        createOrder: createOrder,
        updateOrder: updateOrder,
        getOrdersForUser: getOrdersForUser,
        initOrdersFromFile: initOrdersFromFile
    };
})();
