function showSection(sectionClass) {
    const sections = document.querySelectorAll("main section");
    sections.forEach(sec => 
        sec.style.display = "none"
    );
    const sectionToShow = document.querySelector(`.${sectionClass}`);
    if (sectionToShow)
        sectionToShow.style.display = "block";
}

// Function to show landing page
function showLandingPage() {
    showSection("welcome-section");
    document.querySelector(".app-header").style.display = "none";
    document.querySelector(".sidebar").style.display = "none";
}

// Function to show registration form
function showRegistrationSection() {
    showSection("registration-section");
    document.querySelector(".registration-section").style.display = "flex";
}

// Function to show login form
function showLoginSection() {
    showSection("login-section");
    document.querySelector(".login-section").style.display = "flex";
}

// Function to show forgot password
function showForgotPasswordSection() {
    showSection("forgot-password-section");
    document.querySelector(".forgot-password-section").style.display = "flex";
}

// Function to show reset password
function showResetPasswordSection() {
    showSection("reset-password-section");
    document.querySelector(".reset-password-section").style.display = "flex";
}

function showSidebar(){
    const toggle = document.querySelector('.toggle');
    const sidebar = document.querySelector('.sidebar');
    toggle.addEventListener('click', function(){
        sidebar.classList.toggle('close')
    })
}
// Function to show dashboard after login
function showDashboard() {
    showSection("dashboard-section");
    document.querySelector(".app-header").style.display = "flex";
    document.querySelector(".sidebar").style.display = "inline-block";
    showSidebar();
    let usernameSpan = document.querySelector('.user-name');
    let usernameDisplay = localStorage.getItem('currentUser');
    if (usernameDisplay){
        
        usernameSpan.textContent = usernameDisplay;
    } 
}


// Back button handlers

function registrationBackBtn() {
    showLandingPage();
}
function loginBackBtn() {
    showLandingPage();
}
function forgotPasswordBackBtn() {
    showLoginSection();
}
function resetPasswordBackBtn() {
    showLoginSection();
}

// Initial setup on page load

