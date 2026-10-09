# PathForge – Frontend Web Application

PathForge Frontend is a modern, responsive web application for the **PathForge** AI-powered skill and career guidance platform designed for B.Tech students.

## 🚀 Key Features

* **Authentication & Access:** Login (`login.html`), Registration (`register.html`), Admin Portal (`admin.html`).
* **Dashboard:** Personal stage status, job readiness gauge, daily recommended task list (`dashboard.html`).
* **Skill Gap Analysis:** Industry requirements vs. current student skill breakdown (`skill-gap.html`).
* **Dynamic Roadmaps:** Interactive learning phase visualizer (`roadmap.html`).
* **Assessment & Quizzes:** Interactive skill tests with automated scoring (`assessment.html`).
* **Project Hub:** Real-world project recommendations and GitHub repository submissions (`projects.html`).
* **YouTube Analyzer:** Video content analysis for skill extracting (`youtube.html`).
* **Progress Tracking:** Multi-dimensional skill readiness overview (`progress.html`).

## 🛠️ Technology Stack

* **HTML5** & **CSS3** (Custom responsive design in `css/main.css`)
* **Bootstrap 5.3** & **Bootstrap Icons**
* **JavaScript (Vanilla ES6)** (`js/app.js` with `fetch` REST client integration)

## 📁 Project Directory Structure

```text
PathForge-Frontend/
├── css/
│   └── main.css           # Custom styling and design system
├── js/
│   └── app.js             # Central REST API helper, JWT session manager & navbar setup
├── index.html             # Platform Landing Page
├── login.html             # User Login Page
├── register.html          # Student Registration Page
├── dashboard.html         # Main Student Dashboard
├── profile.html           # Profile & Career Goal Settings
├── assessment.html        # Skill Assessment & Quiz Interface
├── skill-gap.html         # Skill Gap Analysis Page
├── roadmap.html           # Dynamic Roadmap Visualizer
├── projects.html          # Real-world Project Recommendations
├── youtube.html           # YouTube Video Learning Analyzer
├── progress.html          # Progress Tracking Overview
├── resources.html         # Curated Learning Resources
├── admin.html             # Admin Management Portal
├── .gitignore
└── README.md
```

## ⚡ How to Run

1. Ensure the **PathForge Backend** REST API is running (by default at `http://localhost:8080`).
2. Serve `PathForge-Frontend` using any static HTTP server or launch directly in a browser:
   * **Live Server (VS Code Extension)**: Right-click `index.html` -> *Open with Live Server*.
   * **Python HTTP Server**:
     ```bash
     python -m http.server 5500
     ```
   * **Node `http-server`**:
     ```bash
     npx http-server -p 5500
     ```
3. Open `http://localhost:5500` or `index.html` in your browser.

## 🔗 Backend API Connection

The frontend automatically detects whether it is served standalone or alongside the backend. It directs REST calls to `http://localhost:8080/api` with JWT authorization headers stored securely in browser `localStorage`.
