// PathForge Frontend Runtime Configuration
// Used by PathForge-Frontend on local dev and production (Vercel)

(function () {
    // If window.PATHFORGE_API_BASE is already set (e.g. inline script or env injection), keep it.
    if (window.PATHFORGE_API_BASE) {
        return;
    }

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // DEFAULT CONFIGURATION:
    // - Localhost uses local Spring Boot port 8080 (http://localhost:8080/api)
    // - Deployed production (Vercel) uses your deployed Render backend URL.
    window.PATHFORGE_API_BASE = isLocalhost
        ? 'http://localhost:8080/api'
        : 'https://pathforge-backend-1-vpr0.onrender.com/api';
})();
