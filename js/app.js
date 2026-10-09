// PathForge Central Frontend Application Script
const API_BASE = (window.location.protocol.startsWith('http') && window.location.port === '8080')
    ? '/api'
    : 'http://localhost:8080/api';

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
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
        const errText = await response.text();
        try {
            const errJson = JSON.parse(errText);
            throw new Error(errJson.message || 'API request failed');
        } catch(e) {
            throw new Error(errText || 'API request failed');
        }
    }

    return response.json();
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
                <a href="/login.html" class="btn btn-sm btn-pf-outline me-2">Login</a>
                <a href="/register.html" class="btn btn-sm btn-pf-primary">Register</a>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
});
