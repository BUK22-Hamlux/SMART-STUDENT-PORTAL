window.addEventListener("DOMContentLoaded", () => {

    showLandingPage();

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
});

    


