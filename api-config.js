const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : "https://cyberforge-ai-backend.onrender.com";

window.API_BASE_URL = API_BASE_URL;
console.log("Global API Base URL set to:", window.API_BASE_URL);
