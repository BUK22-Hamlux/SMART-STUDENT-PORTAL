
// VALIDATION HELPERS
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(pw) {
    return pw.length >= 8 && /\d/.test(pw);
}

function showError(inputEl, message) {
    const parent = inputEl.parentElement;
    const oldError = parent.querySelector(".error");
    if (oldError) oldError.remove();

    const err = document.createElement("div");
    err.classList.add("error");
    err.textContent = message;
    parent.appendChild(err);
}

function clearErrors(formEl) {
    const errors = formEl.querySelectorAll(".error");
    errors.forEach(e => e.remove());
}
function showSuccess(inputEl, message) {
    const parent = inputEl.parentElement;
    const oldMsg = parent.querySelector(".success");
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement("div");
    msg.classList.add("success");
    msg.textContent = message;
    parent.appendChild(msg);
}

// UI NAVIGATION HELPERS

window.addEventListener("DOMContentLoaded", () => {

    // Hide all sections except landing
    showLandingPage();

    // Landing page buttons
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");

    if(registerBtn) 
        registerBtn.addEventListener("click", showRegistrationSection);
    if(loginBtn) 
        loginBtn.addEventListener("click", showLoginSection);

    // Back buttons inside forms
    const regBackBtn = document.getElementById("registration-back-btn");
    if(regBackBtn) 
        regBackBtn.addEventListener("click", e => {
        e.preventDefault();
        registrationBackBtn();
    });

    const loginBackBtnEl = document.getElementById("login-back-btn");
    if(loginBackBtnEl) 
        loginBackBtnEl.addEventListener("click", e => {
        e.preventDefault();
        loginBackBtn();
    });


    // REGISTRATION FORM VALIDATION

    const regForm = document.querySelector(".registration-form");

    if (regForm) {
        regForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clearErrors(regForm);

            const username = document.getElementById("reg-username");
            const email = document.getElementById("reg-email");
            const password = document.getElementById("reg-password");
            const confirm = document.getElementById("reg-confirm-password");

            let valid = true;

            if (username.value.trim().length < 3) {
                showError(username, "Username must be at least 3 characters");
                valid = false;
            }

            if (!validateEmail(email.value)) {
                showError(email, "Enter a valid email address");
                valid = false;
            }

            if (!validatePassword(password.value)) {
                showError(password, "Password must be 8 characters and include a number");
                valid = false;
            }

            if (password.value !== confirm.value) {
                showError(confirm, "Passwords do not match");
                valid = false;
            }

            if (valid) {
                // Get existing users from localStorage
                let users = JSON.parse(localStorage.getItem("users")) || [];

                // Check if email or username already exists
                const exists = users.some(u => u.email === email.value || u.username === username.value);
                if (exists) {
                    alert("Username or email already exists!");
                    return;
                }

                // Add new user
                const newUser = {
                    username: username.value,
                    email: email.value,
                    password: password.value
                };

                users.push(newUser);

                // Save back to localStorage
                localStorage.setItem("users", JSON.stringify(users));

                alert("Registration successful!");

                // Clear the form
                regForm.reset();

                // Show login page after registration
                showLoginSection();

            }
        });
    }

    // LOGIN FORM VALIDATION

    const loginForm = document.querySelector(".login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clearErrors(loginForm);

            const userField = document.getElementById("login-username");
            const pwField = document.getElementById("login-password");

            let valid = true;

            if (userField.value.trim() === "") {
                showError(userField, "This field is required");
                valid = false;
            }
            if (userField.value.trim().length < 3){
                showError(userField, "Username must be at least 3 characters");
                valid = false;
            }

            if (pwField.value.trim() === "") {
                showError(pwField, "Password is required");
                valid = false;
            }
            if (!validatePassword(pwField.value)) {
                showError(pwField, "Password must be 8 characters and include a number");
                valid = false;
            }

            if (valid) {
                alert("Login input is valid!");
                showDashboard();
            }
        });
    }


    // FORGOT PASSWORD VALIDATION

    const forgotForm = document.querySelector(".forgot-password-form");

    if (forgotForm) {
        forgotForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clearErrors(forgotForm);

            const email = document.getElementById("forgot-email");

            if (!validateEmail(email.value)) {
                showError(email, "Enter a valid email address");
                return;
            }

            alert("Forgot password input valid!");
            // call requestPasswordReset() later
        });
    }

    // RESET PASSWORD VALIDATION

    const resetForm = document.querySelector(".reset-password-form");

    if (resetForm) {
        resetForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clearErrors(resetForm);

            const newPw = document.getElementById("new-password");
            const confirmPw = document.getElementById("confirm-new-password");

            let valid = true;

            if (!validatePassword(newPw.value)) {
                showError(newPw, "Password must be 8 characters and include a number");
                valid = false;
            }

            if (newPw.value !== confirmPw.value) {
                showError(confirmPw, "Passwords do not match");
                valid = false;
            }

            if (valid) {
                showLoginSection()
                alert("Password reset input is valid!");
                // performPasswordReset() later
            }
        });
    }



});

