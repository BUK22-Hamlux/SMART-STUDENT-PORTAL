// ── INIT ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Apply saved theme
  if (localStorage.getItem("sp_theme") === "dark") {
    document.body.classList.add("dark");
  }

  // Check if user is already logged in
  const currentUser = localStorage.getItem("sp_currentUser");
  if (currentUser) {
    showDashboard();
  } else {
    showLandingPage();
  }

  // Welcome page buttons
  document
    .querySelector(".register-btn")
    .addEventListener("click", showRegistrationSection);
  document
    .querySelector(".login-btn")
    .addEventListener("click", showLoginSection);
});
