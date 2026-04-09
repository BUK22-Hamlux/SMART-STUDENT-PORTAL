function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(pw) {
  return pw.length >= 8 && /\d/.test(pw);
}
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = msg ? "block" : "none";
  }
}
function clearErrors(...ids) {
  ids.forEach((id) => setError(id, ""));
}

// ── REGISTRATION ──
document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.querySelector(".registration-form");
  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const fullname = document.getElementById("reg-fullname").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirm = document.getElementById("reg-confirm-password").value;

      clearErrors(
        "err-reg-username",
        "err-reg-email",
        "err-reg-fullname",
        "err-reg-password",
        "err-reg-confirm",
      );
      let valid = true;

      if (username.length < 3) {
        setError("err-reg-username", "Username must be at least 3 characters");
        valid = false;
      }
      if (!isValidEmail(email)) {
        setError("err-reg-email", "Enter a valid email address");
        valid = false;
      }
      if (fullname.length < 2) {
        setError("err-reg-fullname", "Full name is required");
        valid = false;
      }
      if (!isValidPassword(password)) {
        setError(
          "err-reg-password",
          "Password must be 8+ characters and include a number",
        );
        valid = false;
      }
      if (password !== confirm) {
        setError("err-reg-confirm", "Passwords do not match");
        valid = false;
      }

      if (!valid) return;

      if (userExists(email, username)) {
        setError("err-reg-username", "Username or email already exists");
        return;
      }

      saveUser({
        username,
        email,
        fullname,
        password,
        bio: "",
        avatar: null,
        dept: "",
        level: "",
        matric: "",
      });
      showToast("Account created successfully! Please sign in.", "success");
      regForm.reset();
      showLoginSection();
    });
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;

      clearErrors("err-login-username", "err-login-password");
      let valid = true;

      if (username.length < 1) {
        setError("err-login-username", "Username is required");
        valid = false;
      }
      if (password.length < 1) {
        setError("err-login-password", "Password is required");
        valid = false;
      }
      if (!valid) return;

      const user = validateLogin(username, password);
      if (!user) {
        setError("err-login-password", "Invalid username or password");
        return;
      }

      const remember = document.getElementById("rememberMe").checked;
      localStorage.setItem("sp_currentUser", username);
      if (remember) localStorage.setItem("sp_remember", username);

      showToast("Welcome back, " + user.fullname || username + "!", "success");
      showDashboard();
    });
  }

  // ── FORGOT PASSWORD ────────────────────────────────────────────────────
  const forgotForm = document.querySelector(".forgot-password-form");
  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("forgot-email").value.trim();
      clearErrors("err-forgot-email");
      if (!isValidEmail(email)) {
        setError("err-forgot-email", "Enter a valid email");
        return;
      }
      showToast("Password reset instructions sent! (Demo mode)", "info");
      showResetPasswordSection();
    });
  }

  // ── RESET PASSWORD ─────────────────────────────────────────────────────
  const resetForm = document.querySelector(".reset-password-form");
  if (resetForm) {
    resetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newPw = document.getElementById("new-password").value;
      const confPw = document.getElementById("confirm-new-password").value;
      clearErrors("err-new-password", "err-confirm-new-password");
      let valid = true;
      if (!isValidPassword(newPw)) {
        setError(
          "err-new-password",
          "Password must be 8+ chars and include a number",
        );
        valid = false;
      }
      if (newPw !== confPw) {
        setError("err-confirm-new-password", "Passwords do not match");
        valid = false;
      }
      if (!valid) return;
      showToast("Password updated successfully!", "success");
      showLoginSection();
    });
  }

  // ── PASSWORD TOGGLE ────────────────────────────────────────────────────
  document.querySelectorAll(".pw-toggle").forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = document.getElementById(icon.dataset.target);
      if (!input) return;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      icon.classList.toggle("bx-hide", !isHidden);
      icon.classList.toggle("bx-show", isHidden);
    });
  });
});
