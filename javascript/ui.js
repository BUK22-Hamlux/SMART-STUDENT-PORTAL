    
    // BODY DOM
    const overlay = document.getElementById("modalOverlay");
    

    // APP HEADER DOM
    const appHeaderInfo = document.querySelector('.app-header-info');
    const appHeaderText = document.querySelector('.app-header-text');

    // SIDEBAR DOM
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.querySelector('.toggle');

    

// STARTER FUNCTIONS DECLARATION

// function to select which section to show
function showSection(sectionClass) {
    const sections = document.querySelectorAll("section");
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

// BACK BUTTON HANDLERS

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

// function to show the content to the app header at the right
function showHeaderLeft(headerLeft) {
    const headerInfoLeft = document.querySelectorAll(".header-info-left");
    headerInfoLeft.forEach(left => 
        left.style.display = "none"
    );
    const headerInfoToShow = document.querySelector(`.${headerLeft}`);
    if (headerInfoToShow)
        headerInfoToShow.style.display = "inline-block";
}

// FUNCTION TO SHOW SIDEBAR
function showSidebar(){
    document.querySelector(".app-header").style.display = "flex";
    sidebar.style.display = "inline-block";
    toggle.addEventListener('click', function(){
        sidebar.classList.toggle('close')
    })
}

// DASHBOARD SECTION


// DASHBOARD DOM
const appHeaderImage = document.getElementById('header-profile-picture');
// function to show dashboard
function showDashboard() {
    showSection("dashboard-section");
    showSidebar();
    showHeaderLeft('user-img')
    appHeaderInfo.textContent = 'Dashboard';
    let usernameDisplay = localStorage.getItem('currentUser');
    if (usernameDisplay){
        appHeaderText.textContent = 'welcome back ' + usernameDisplay;
    } 
    else{
        appHeaderText.textContent = 'welcome back Student';
    }

}


// PROFILE SECTION


// PROFILE DOM
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const bio = document.getElementById('bio');
    const editBtn = document.getElementById('editBtn');
    const edit = document.querySelector('.edit');
    const camera = document.querySelector('.bx-camera');
    let username = document.querySelector('.username');
    let useremail = document.querySelector('.useremail');
    const originalInput = {
        fullname: '',
        email: '',
        bio: '',
    }
    const imageInput = document.getElementById('image-upload-input');
    const profilePicDisplay = document.getElementById('profile-pic-display');


// ALL PROFILE FUNCTIONS

// function to show profile page
function showProfile(){
    showSection('profile-section');
    showHeaderLeft('user-img');
    username.textContent = fullName.value;
    useremail.textContent = email.value;
    appHeaderInfo.textContent = 'Profile';
    appHeaderText.innerHTML = 'Manage your profile information';

}

// function for edit profile
function editProfileBtn(){
    originalInput.fullname = fullName.value;
    originalInput.email = email.value;
    originalInput.bio = bio.value;
    edit.style.display = 'grid';
    camera.style.display = 'block'
    editBtn.style.display = 'none';
    fullName.removeAttribute('disabled')
    email.removeAttribute('disabled')
    bio.removeAttribute('disabled')
}

// function to save editted profile
function saveChangesBtn(){
    edit.style.display = 'none';
    camera.style.display = 'none';
    editBtn.style.display = 'block'
    fullName.setAttribute('disabled','disabled')
    email.setAttribute('disabled','disabled')
    bio.setAttribute('disabled','disabled')
    username.textContent = fullName.value;
    useremail.textContent = email.value;
}

// function to cancel edit profile
function cancelChangesBtn(){
    fullName.value = originalInput.fullname;
    email.value = originalInput.email;
    bio.value = originalInput.bio;
    edit.style.display = 'none';
    camera.style.display = 'none'
    editBtn.style.display = 'block'
    fullName.setAttribute('disabled','disabled')
    email.setAttribute('disabled','disabled')
    bio.setAttribute('disabled','disabled')
}

// ALL PROFILE MANIPULATION AND CONTROL CODES
imageInput.addEventListener('change', function(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
        if (selectedFile.type.startsWith('image/')) {
            
            const fileURL = URL.createObjectURL(selectedFile);
            
            profilePicDisplay.src = fileURL;
            appHeaderImage.src = fileURL;
        } 
        else {
            alert("Please select a valid image file.");
            e.target.value = null; 
        }
    }
});


// COURSES SECTION


// COURSE DOM
  const addCourseBtn = document.querySelector(".add-course-btn");
  const cancelCourseBtn = document.getElementById("cancelCourse");
  const saveCourseBtn = document.getElementById('saveCourse');
  let courseTitle = document.getElementById('courseTitleInput');
  let courseInstructor = document.getElementById('courseInstructorInput');
  let courseCredit = document.getElementById('courseCreditInput');
  let selectSemester = document.getElementById('selectSemester');
  let courseErrorMessage = document.getElementById('addCourseErrorMessage');
  const courseModal = document.getElementById("addCourseModal");
  const coursesContainer = document.querySelector('.courses')
  let courseBeignEdit = null;
  const sortSelect = document.getElementById("courseSort");




// ALL COURSES SECTION FUNCTIONS

// function to show course section
function showCourse(){
    showSection('course-section');
    showHeaderLeft('add-course-btn');
    appHeaderInfo.textContent = 'Course Management';
    appHeaderText.innerHTML = 'view and manage your courses';   
}

// function to creeate new course
function createNewCourse() {
  const title = courseTitle.value.trim();
  const instructor = courseInstructor.value.trim();
  const credit = courseCredit.value.trim();
  const semester = selectSemester.value;

  if (!title || !instructor || !credit || !semester) {
    courseErrorMessage.style.display = 'block';
    courseErrorMessage.textContent = 'All field are required';
    return;
  }

  if (courseBeignEdit) {
    courseBeignEdit.querySelector("h3").innerText = title;
    courseBeignEdit.querySelector("div:nth-child(2) p").innerText = instructor;
    courseBeignEdit.querySelector("div:nth-child(3) p:last-child").innerText = credit;
    courseBeignEdit.querySelector("div:nth-child(4) p:last-child").innerText = semester;

    courseBeignEdit = null;
    saveCourseBtn.innerText = "Add Course";
  }
  
  else{
    const courseInfo = document.createElement("div");
    courseInfo.className = "course-info";

    courseInfo.innerHTML = `
      <div>
        <h3>${title}</h3>
        <div>
          <i class="bx bx-pencil edit-course"></i>
          <i class="bx bx-trash delete-course"></i>
        </div>
      </div>

      <div>
        <p>${instructor}</p>
      </div>

      <div>
        <p>Credits:</p>
        <p>${credit}</p>
      </div>

      <div>
        <p>Semester:</p>
        <p>${semester}</p>
      </div>

      <div>
        <p>Grade</p>
        <p style="color: var(--success-color);">-</p>
      </div>
    `;

    coursesContainer.appendChild(courseInfo);
  }

  applySemesterFilter();
  handleSort();
  closeCourseModal();
  resetCourseForm();
}

// function to edit course info
function openCourseEditModal(courseInfo) {
  courseBeignEdit = courseInfo;

  const title = courseInfo.querySelector("h3").innerText;
  const instructor = courseInfo.querySelector("div:nth-child(2) p").innerText;
  const credit = courseInfo.querySelector("div:nth-child(3) p:last-child").innerText;
  const semester = courseInfo.querySelector("div:nth-child(4) p:last-child").innerText;

  courseTitle.value = title;
  courseInstructor.value = instructor;
  courseCredit.value = credit;
  selectSemester.value = semester;

  saveCourseBtn.innerText = "Update Course";

  courseModal.style.display = "block";
  overlay.style.display = "block";
}

function handleSort() {
  const sortBy = sortSelect.value;

  const courses = Array.from(
    coursesContainer.querySelectorAll(".course-info")
  );

  if (sortBy === "title") {
    courses.sort((a, b) => {
      const titleA = a.querySelector("h3").innerText.toLowerCase();
      const titleB = b.querySelector("h3").innerText.toLowerCase();
      return titleA.localeCompare(titleB);
    });
  }

  if (sortBy === "credit") {
    courses.sort((a, b) => {
      const creditA = Number(
        a.querySelector("div:nth-child(3) p:last-child").innerText
      );
      const creditB = Number(
        b.querySelector("div:nth-child(3) p:last-child").innerText
      );
      return creditA - creditB;
    });
  }

  // Re-append in sorted order
  courses.forEach(course => coursesContainer.appendChild(course));
}

// function to set all add new course input values back to default
function resetCourseForm() {
  courseTitle.value = "";
  courseInstructor.value = "";
  courseCredit.value = "";
  selectSemester.selectedIndex = 0;
}

// function to close the add new course sub section 
function closeCourseModal() {
  courseModal.style.display = "none";
  overlay.style.display = "none";
}


// ALL COURSES MANIPULATION AND CONTROL CODES
addCourseBtn.addEventListener("click", () => {
  courseModal.style.display = "block";
  overlay.style.display = "block";
});
saveCourseBtn.addEventListener('click', createNewCourse);
cancelCourseBtn.addEventListener("click", () =>{
    courseBeignEdit = null;
    saveCourseBtn.innerText = "Add Course";
    closeCourseModal();
    resetCourseForm();

});
overlay.addEventListener("click", () =>{
    courseBeignEdit = null;
    saveCourseBtn.innerText = "Add Course";
    closeCourseModal();
    resetCourseForm();
});

coursesContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-course")) {
    const courseInfo = e.target.closest(".course-info");

    if (!courseInfo) return;

    const confirmDelete = confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
      courseInfo.remove();
      return;
    }
  }
  if (e.target.classList.contains("edit-course")) {
    const courseInfo = e.target.closest(".course-info");
    if (!courseInfo) return;

    openCourseEditModal(courseInfo);
  }
});


  const semesterFilter = document.getElementById("semesterFilter");
  semesterFilter.addEventListener("change", applySemesterFilter);

function applySemesterFilter(){
  const filterValue = semesterFilter.value;
  const courses = document.querySelectorAll(".course-info");
  courses.forEach (course => {
    const courseSemester = course.querySelector("div:nth-child(4) p:last-child").innerText.toLowerCase();
      
    if (filterValue === "allSemester" ||  
    (filterValue === "firstSemester" && courseSemester.includes("first")) ||
    (filterValue === "secondSemester" && courseSemester.includes("second"))
    ){
      course.style.display = "block";
    }
    else {
      course.style.display = "none";
    }
  });
}

sortSelect.addEventListener('change', handleSort);


// ASSINGMENT SECTION

// ASSIGNMENT DOM

const assignmentLink = document.getElementById('assignmentLink');
const addAssignmentBtn = document.querySelector('.add-assignment-btn')
const assignmentModal = document.getElementById('addAssignmentModal')
const cancelAssignmentBtn = document.getElementById('cancelAssignment');
const saveAssignmentBtn = document.getElementById('saveAssignment');
let assignmentTitle = document.getElementById('assignmentTitleInput');
let courseSelect = document.getElementById('selectCourse');
let dueDate = document.getElementById('dueDate'); 
let assignmentErrorMessage = document.getElementById('assignmentErrorMessage')
let assignmentContainer = document.querySelector('.assignments');
let assignmentCourseFilter = document.getElementById('selectCourseFilter');
let submitAssignment = document.getElementById('submitAssignmentModal');
const fileInput = document.getElementById("submit-file-upload-input");
const submitUploadBtn = document.getElementById('submitAssignmentUpload');
const uploadBox = document.querySelector(".file-upload-container");
let activeAssignment = null;



// ASSIGNMENT FUNCTIONS
function closeAssignmentModal() {
  assignmentModal.style.display = "none";
  overlay.style.display = "none";
}
function resetAssignmentForm() {
  assignmentTitle.value = "";
  courseSelect.selectedIndex = 0;
  dueDate.value = "";
}

function createNewAssignment() {
  const title = assignmentTitle.value.trim();
  const course = courseSelect.value;
  const due = dueDate.value;
    if (!title || !course || !due) {
    assignmentErrorMessage.style.display = 'block';
    assignmentErrorMessage.textContent = 'All field are required';
    return;
  }

    const assignmentInfo = document.createElement("div");
    assignmentInfo.className = "assignment-info";

    assignmentInfo.innerHTML = `
      <div class="assignment-info-left">
        <i class="bx bx-hourglass"></i>
        <div>
          <h3>${title}</h3>
          <p data-course="${course.toLowerCase()}">${course}</p>
          <p>Due: ${due}</p>
        </div>
      </div>
      <div class="assignment-info-submit">
        <i class='bx  bx-arrow-from-bottom'></i> 
        <p>Submit</p>
      </div>     
    `;

    assignmentContainer.appendChild(assignmentInfo);
    closeAssignmentModal();
    resetAssignmentForm();
    applyAssignmentCourseFilter();
    assignmentErrorMessage.textContent = "";
  }

function markAssignmentAsSubmitted(assignmentInfo) {
  // Prevent double submission
  if (assignmentInfo.classList.contains("submitted")) return;

  assignmentInfo.classList.add("submitted");

  // 1. Change left icon background to green
  const leftIcon = assignmentInfo.querySelector(".assignment-info-left i");
  leftIcon.className = "bx bx-check-circle"
  leftIcon.style.backgroundColor = "var(--success-color)";
  leftIcon.style.color = "#fff";

  // 2. Change submit button appearance + text
  const submitBtn = assignmentInfo.querySelector(".assignment-info-submit");
  submitBtn.style.backgroundColor = "var(--success-color)";
  submitBtn.style.cursor = "default";

  const submitText = submitBtn.querySelector("p");
  submitText.textContent = "Submitted";

  const submitIcon = submitBtn.querySelector("i");
  submitIcon.className = "bx bx-check";

  // 3. Add submission time info
  const assignmentDetails = assignmentInfo.querySelector('.assignment-info-left div')
  const submittedInfo = document.createElement("div");
  submittedInfo.className = "assignment-submitted-info";

  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString();

  submittedInfo.innerHTML = `
    <p><strong>Submitted on:</strong> ${formattedDate}</p>
    <p><strong>Time:</strong> ${formattedTime}</p>
  `;

  assignmentDetails.appendChild(submittedInfo);
}

function validateSubmissionFile(file) {
  if (!file) {
    alert("Please upload a file before submitting.");
    return false;
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip"
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Invalid file type. Only PDF, DOC, DOCX, ZIP allowed.");
    return false;
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("File size exceeds 10MB limit.");
    return false;
  }

  return true;
}

function showSelectedFile(file) {
  uploadBox.innerHTML = `
    <i class="bx bx-file"></i>
    <p><strong>${file.name}</strong></p>
    <p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>
  `;

  uploadBox.classList.add("file-selected");
}
function resetUpload() {
  uploadBox.innerHTML = `
    <i class="bx bx-arrow-from-bottom"></i>
    <p>Click to Upload File</p>
    <p>PDF, DOC, ZIP (max 10MB)</p>
  `;
  uploadBox.classList.remove("file-selected");
}
function closeSubmitModal() {
  submitAssignment.style.display = "none";
  overlay.style.display = "none";
  fileInput.value = "";
  document.getElementById("submitNote").value = "";
  resetUpload();
  activeAssignment = null;
}


function openSubmitModal() {
  overlay.style.display = 'block';
  submitAssignment.style.display = 'block';
}

function applyAssignmentCourseFilter() {
  const filterValue = assignmentCourseFilter.value;
  const assignments = document.querySelectorAll(".assignment-info");

  assignments.forEach(assignment => {
    const courseValue = assignment.querySelector("[data-course]").dataset.course;

    if (filterValue === "all courses" || courseValue === filterValue) {
      assignment.style.display = "flex";
    } else {
      assignment.style.display = "none";
    }
  });
}



// ASSIGNMENT  MANIPULATION
assignmentLink.addEventListener('click', function(){
  showSection('assignment-section');
  showHeaderLeft('add-assignment-btn');
  appHeaderInfo.textContent = 'Assignments';
  appHeaderText.innerHTML = 'Track and submit your assignments';
})

addAssignmentBtn.addEventListener('click', function(){
  overlay.style.display = 'block';
  assignmentModal.style.display = 'block';
})
cancelAssignmentBtn.addEventListener("click", () =>{
    closeAssignmentModal();
    resetAssignmentForm();

});
overlay.addEventListener("click", () =>{
    courseBeignEdit = null;
    saveCourseBtn.innerText = "Add Course";
    closeAssignmentModal();
    resetCourseForm();
});
saveAssignmentBtn.addEventListener('click', createNewAssignment);

assignmentContainer.addEventListener("click", function (e) {
  const submitBtn = e.target.closest(".assignment-info-submit");
  if (!submitBtn) return;

  const assignmentInfo = submitBtn.closest(".assignment-info");
  if (!assignmentInfo) return;

  activeAssignment = assignmentInfo;
  openSubmitModal();
 
});

submitUploadBtn.addEventListener('click', () => {
  if (!activeAssignment) return;
  const file = fileInput.files[0];
  if (!validateSubmissionFile(file)) return;
  markAssignmentAsSubmitted(activeAssignment);
  closeSubmitModal();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  if (!validateSubmissionFile(file)) {
    fileInput.value = "";
    resetUpload();
    return;
  }

  showSelectedFile(file);
});
assignmentCourseFilter.addEventListener("change", applyAssignmentCourseFilter);
