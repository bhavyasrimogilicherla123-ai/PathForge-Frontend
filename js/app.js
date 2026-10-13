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
        : 'https://pathforge-backend-1-vpr0.onrender.com/api';
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
        throw new Error(`Unable to reach backend server at ${apiBase}. Please verify that the Render backend service is running and CORS is enabled.`);
    }

    if (response.status === 401) {
        logout();
        throw new Error('Session expired or unauthorized. Please log in again.');
    }

    // Safely retrieve the response body as text first to avoid uncaught JSON parsing exceptions
    let rawText = '';
    try {
        rawText = await response.text();
    } catch (readErr) {
        console.warn('Error reading response body:', readErr);
    }

    const trimmedText = (rawText || '').trim();
    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    // Safely parse JSON if content appears to be JSON or header indicates JSON
    let responseData = null;
    let isJson = false;

    if (trimmedText && (trimmedText.startsWith('{') || trimmedText.startsWith('[') || contentType.includes('application/json'))) {
        try {
            responseData = JSON.parse(trimmedText);
            isJson = true;
        } catch (jsonErr) {
            console.warn('Response content could not be parsed as JSON:', jsonErr);
            responseData = null;
            isJson = false;
        }
    }

    // Handle non-2xx HTTP statuses
    if (!response.ok) {
        let errorMessage = '';

        if (isJson && responseData) {
            // Support standard and Spring Boot error payload formats
            if (typeof responseData.message === 'string' && responseData.message.trim()) {
                errorMessage = responseData.message.trim();
            } else if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
                errorMessage = responseData.errors
                    .map(e => typeof e === 'string' ? e : (e.defaultMessage || e.message || JSON.stringify(e)))
                    .join(', ');
            } else if (typeof responseData.error === 'string' && responseData.error.trim()) {
                errorMessage = responseData.error.trim();
            }
        }

        // If no error message from JSON, inspect raw text and HTTP status
        if (!errorMessage) {
            const isHtml = trimmedText.startsWith('<!') || trimmedText.startsWith('<html') || trimmedText.startsWith('<?xml') || /<[a-z][\s\S]*>/i.test(trimmedText);
            if (!isHtml && trimmedText && trimmedText.length < 300) {
                errorMessage = trimmedText;
            } else if (response.status === 404) {
                errorMessage = `API endpoint not found (HTTP 404). Please verify backend URL and route: ${apiBase}${endpoint}`;
            } else if (response.status === 500) {
                errorMessage = 'Internal server error occurred on backend. Please check backend logs or try again later.';
            } else if (response.status === 502 || response.status === 503 || response.status === 504) {
                errorMessage = `Backend server is temporarily unavailable or waking up (HTTP ${response.status}). Please wait a few moments and try again.`;
            } else {
                errorMessage = `Request failed with HTTP ${response.status}: ${response.statusText || 'Error'}`;
            }
        }

        throw new Error(errorMessage);
    }

    // For 2xx responses, return parsed JSON if valid, or empty object for empty body, or raw text
    if (isJson && responseData !== null) {
        return responseData;
    }

    if (!trimmedText) {
        return {};
    }

    return trimmedText;
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
