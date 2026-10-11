// PathForge Central Frontend Application Script


function getApiBaseUrl() {
    if (window.PATHFORGE_API_BASE) {
        return window.PATHFORGE_API_BASE.replace(/\/+$/, '');
    }

    const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

    return isLocalhost
        ? 'http://localhost:8080/api'
        : 'https://pathforge-backend.onrender.com/api';
}

function getToken() {
    return localStorage.getItem('pathforge_token');
}

function getUserInfo() {
    const userStr = localStorage.getItem('pathforge_user');
    return userStr ? JSON.parse(userStr) : null;
}

function setAuthSession(token, user) {
    localStorage.setItem('pathforge_token', token);
    localStorage.setItem('pathforge_user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('pathforge_token');
    localStorage.removeItem('pathforge_user');
    window.location.href = 'login.html';
}

async function apiFetch(endpoint, options = {}) {
    const apiBase = getApiBaseUrl();
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${apiBase}${endpoint}`, {
            ...options,
            headers
        });
    } catch (networkErr) {
        console.error('Network Error during API fetch:', networkErr);
        throw new Error(`Unable to reach backend server at ${apiBase}. Please verify the backend service on Render is running and CORS is enabled.`);
    }

    if (response.status === 401) {
        logout();
        throw new Error('Session expired or unauthorized. Please log in again.');
    }

    const contentType = response.headers.get('content-type') || '';
    let responseData = null;
    let rawText = '';

    try {
        rawText = await response.text();
        if (contentType.includes('application/json') && rawText) {
            responseData = JSON.parse(rawText);
        }
    } catch (parseErr) {
        console.warn('Response parsing notice:', parseErr);
    }

    if (!response.ok) {
        const errorMsg = responseData?.message || (rawText && !rawText.startsWith('<!') ? rawText : `HTTP Error ${response.status}: ${response.statusText}`);
        throw new Error(errorMsg);
    }

    return responseData !== null ? responseData : (rawText || {});
}

function setupNavbar() {
    const user = getUserInfo();
    const navUserContainer = document.getElementById('navUserContainer');
    if (navUserContainer) {
        if (user) {
            navUserContainer.innerHTML = `
                <span class="me-3 text-light font-weight-bold"><i class="bi bi-person-circle me-1"></i> ${user.name}</span>
                <button onclick="logout()" class="btn btn-sm btn-outline-danger"><i class="bi bi-box-arrow-right"></i> Logout</button>
            `;
        } else {
            navUserContainer.innerHTML = `
                <a href="login.html" class="btn btn-sm btn-pf-outline me-2">Login</a>
                <a href="register.html" class="btn btn-sm btn-pf-primary">Register</a>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
});
