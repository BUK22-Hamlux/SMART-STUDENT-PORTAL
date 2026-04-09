// ── TOAST ──────────────────────────────────────────────────────────────────
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const icons = {
    success: "bx-check-circle",
    error: "bx-error-circle",
    info: "bx-info-circle",
    warning: "bx-error",
  };
  toast.innerHTML = `<i class='bx ${icons[type] || icons.info}'></i><span>${message}</span><i class='bx bx-x toast-close'></i>`;
  container.appendChild(toast);
  toast
    .querySelector(".toast-close")
    .addEventListener("click", () => toast.remove());
  setTimeout(() => {
    toast.classList.add("toast-hide");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ── DOM REFS ──────────────────────────────────────────────────────────────
const overlay = document.getElementById("modalOverlay");
const body = document.body;
const appHeader = document.querySelector(".app-header");
const appHeaderInfo = document.querySelector(".app-header-info");
const appHeaderText = document.querySelector(".app-header-text");
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle");
const hamburgerBtn = document.getElementById("hamburgerIcon");

// ── SIDEBAR TOGGLE ─────────────────────────────────────────────────────────
toggle.addEventListener("click", () => sidebar.classList.toggle("close"));

hamburgerBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  sidebar.classList.remove("close");
  hamburgerBtn.classList.toggle("bx-menu");
  hamburgerBtn.classList.toggle("bx-x");
});

document.querySelectorAll(".sidebar li").forEach((li) => {
  li.addEventListener("click", () => {
    sidebar.classList.remove("open");
    hamburgerBtn.classList.add("bx-menu");
    hamburgerBtn.classList.remove("bx-x");
  });
});

// ── SECTION SWITCHER ───────────────────────────────────────────────────────
const AUTH_PAGES = [
  "welcome-section",
  "login-section",
  "registration-section",
  "forgot-password-section",
  "reset-password-section",
];

function showSection(cls) {
  document
    .querySelectorAll("section")
    .forEach((s) => (s.style.display = "none"));
  document
    .querySelectorAll(".modal")
    .forEach((m) => (m.style.display = "none"));
  overlay.style.display = "none";

  const sec = document.querySelector("." + cls);
  if (sec)
    sec.style.display = [
      "login-section",
      "registration-section",
      "forgot-password-section",
      "reset-password-section",
    ].includes(cls)
      ? "flex"
      : "block";

  const isAuth = AUTH_PAGES.includes(cls);
  appHeader.style.display = isAuth ? "none" : "flex";
  sidebar.classList.toggle("hidden", isAuth);

  // header actions
  document
    .querySelectorAll(".header-info-left")
    .forEach((el) => (el.style.display = "none"));
  if (!isAuth) document.querySelector(".user-img").style.display = "flex";

  // active sidebar link
  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.remove("active-link"));
  const map = {
    "dashboard-section": "dashboardLink",
    "profile-section": "profileLink",
    "course-section": "courseLink",
    "assignment-section": "assignmentLink",
    "grades-section": "gradesLink",
    "settings-section": "settingsLink",
  };
  if (map[cls]) document.getElementById(map[cls])?.classList.add("active-link");
}

// ── PAGE FUNCTIONS ─────────────────────────────────────────────────────────
function showLandingPage() {
  showSection("welcome-section");
}
function showLoginSection() {
  showSection("login-section");
}
function showRegistrationSection() {
  showSection("registration-section");
}
function showForgotPasswordSection() {
  showSection("forgot-password-section");
}
function showResetPasswordSection() {
  showSection("reset-password-section");
}

// ── AUTH BUTTON WIRING ─────────────────────────────────────────────────────
document.getElementById("showLoginSection").addEventListener("click", (e) => {
  e.preventDefault();
  showLoginSection();
});
document
  .getElementById("showRegistrationSection")
  .addEventListener("click", (e) => {
    e.preventDefault();
    showRegistrationSection();
  });
document
  .getElementById("forgotPasswordSection")
  .addEventListener("click", (e) => {
    e.preventDefault();
    showForgotPasswordSection();
  });
document
  .getElementById("registrationSectionBackBtn")
  .addEventListener("click", showLandingPage);
document
  .getElementById("loginSectionBackBtn")
  .addEventListener("click", showLandingPage);
document
  .getElementById("forgotPasswordBackBtn")
  .addEventListener("click", showLoginSection);
document
  .getElementById("resetPasswordBackBtn")
  .addEventListener("click", showLoginSection);

// ── DASHBOARD ──────────────────────────────────────────────────────────────
function showDashboard() {
  showSection("dashboard-section");
  appHeaderInfo.textContent = "Dashboard";
  const user = getCurrentUser();
  appHeaderText.textContent = user
    ? "Welcome back, " + (user.fullname || user.username) + "!"
    : "Welcome back!";
  updateHeaderAvatar();
  refreshDashboard();
}

function refreshDashboard() {
  const courses = getCourses();
  const assignments = getAssignments();
  const pending = assignments.filter((a) => !a.submitted);
  const submitted = assignments.filter((a) => a.submitted);

  document.getElementById("totalCourse").textContent = courses.length;
  document.getElementById("totalAssignmentDue").textContent = pending.length;
  document.getElementById("totalSubmitted").textContent = submitted.length;

  // GPA
  const gpa = computeGPA();
  document.getElementById("currentGPA").textContent =
    gpa !== null ? gpa.toFixed(2) : "—";

  // Recent assignments list
  const raList = document.getElementById("recentAssignmentsList");
  if (assignments.length === 0) {
    raList.innerHTML =
      '<div class="empty-state"><i class="bx bx-task"></i><p>No assignments yet</p></div>';
  } else {
    raList.innerHTML = assignments
      .slice(-4)
      .reverse()
      .map((a) => {
        const due = new Date(a.dueDate);
        const today = new Date();
        const diff = Math.ceil((due - today) / 86400000);
        const dueStr = a.submitted
          ? '<span class="badge-submitted">Submitted</span>'
          : diff < 0
            ? '<span class="badge-overdue">Overdue</span>'
            : diff === 0
              ? '<span class="badge-due">Due today</span>'
              : `<span class="badge-pending">Due in ${diff}d</span>`;
        return `<div class="list-box">
                <i class="bx ${a.submitted ? "bx-check-circle" : "bx-task"} ${a.submitted ? "icon-submitted" : "icon-pending"}"></i>
                <div class="list-box-info">
                    <p>${a.title}</p>
                    <span class="course-code">${a.course}</span>
                    ${dueStr}
                </div>
            </div>`;
      })
      .join("");
  }

  // Recent courses list
  const rcList = document.getElementById("recentCoursesList");
  if (courses.length === 0) {
    rcList.innerHTML =
      '<div class="empty-state"><i class="bx bx-book-open"></i><p>No courses added yet</p></div>';
  } else {
    rcList.innerHTML = courses
      .slice(-4)
      .map(
        (c) =>
          `<div class="list-box">
                <i class="bx bx-book-open upcoming-icon"></i>
                <div class="list-box-info">
                    <p>${c.title}</p>
                    <span class="course-code">${c.instructor}</span>
                    <p class="class-venue">${c.semester} · ${c.credits} credits</p>
                </div>
            </div>`,
      )
      .join("");
  }
}

document
  .getElementById("dashGoToCourses")
  .addEventListener("click", showCourse);
document
  .getElementById("dashGoToAssignments")
  .addEventListener("click", showAssignmentSection);
document.getElementById("viewAllAssignments").addEventListener("click", (e) => {
  e.preventDefault();
  showAssignmentSection();
});
document.getElementById("viewAllCourses").addEventListener("click", (e) => {
  e.preventDefault();
  showCourse();
});

// ── PROFILE ────────────────────────────────────────────────────────────────
const fullNameInput = document.getElementById("fullName");
const profileEmailIn = document.getElementById("profileEmail");
const bioInput = document.getElementById("bio");
const editProfileBtn = document.getElementById("editProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileChanges");
const cancelProfileBtn = document.getElementById("cancelProfileChanges");
const editDiv = document.querySelector(".edit");
const cameraIcon = document.getElementById("cameraIcon");
const imageInput = document.getElementById("image-upload-input");
const profilePic = document.getElementById("profile-pic-display");
const headerPic = document.getElementById("header-profile-picture");

let originalProfile = {};

function showProfile() {
  showSection("profile-section");
  appHeaderInfo.textContent = "Profile";
  appHeaderText.textContent = "Manage your profile information";
  loadProfileData();
}

function loadProfileData() {
  const user = getCurrentUser();
  if (!user) return;
  fullNameInput.value = user.fullname || "";
  profileEmailIn.value = user.email || "";
  bioInput.value = user.bio || "";
  document.querySelector(".username").textContent =
    user.fullname || user.username;
  document.querySelector(".useremail").textContent = user.email || "";
  if (user.avatar) {
    profilePic.src = user.avatar;
    headerPic.src = user.avatar;
  }

  document.getElementById("acadDept").textContent = user.dept || "—";
  document.getElementById("acadLevel").textContent = user.level || "—";
  document.getElementById("acadMatric").textContent = user.matric || "—";
  document.getElementById("acadGPA").textContent =
    computeGPA() !== null ? computeGPA().toFixed(2) : "—";
}

function updateHeaderAvatar() {
  const user = getCurrentUser();
  if (user?.avatar) {
    headerPic.src = user.avatar;
  }
}

editProfileBtn.addEventListener("click", () => {
  originalProfile = {
    fullname: fullNameInput.value,
    email: profileEmailIn.value,
    bio: bioInput.value,
  };
  [fullNameInput, profileEmailIn, bioInput].forEach((el) =>
    el.removeAttribute("disabled"),
  );
  editDiv.style.display = "flex";
  editProfileBtn.style.display = "none";
  cameraIcon.style.display = "flex";
});

saveProfileBtn.addEventListener("click", () => {
  const username = localStorage.getItem("sp_currentUser");
  updateUser(username, {
    fullname: fullNameInput.value,
    email: profileEmailIn.value,
    bio: bioInput.value,
  });
  [fullNameInput, profileEmailIn, bioInput].forEach((el) =>
    el.setAttribute("disabled", ""),
  );
  editDiv.style.display = "none";
  editProfileBtn.style.display = "block";
  cameraIcon.style.display = "none";
  loadProfileData();
  showToast("Profile updated successfully!", "success");
});

cancelProfileBtn.addEventListener("click", () => {
  fullNameInput.value = originalProfile.fullname;
  profileEmailIn.value = originalProfile.email;
  bioInput.value = originalProfile.bio;
  [fullNameInput, profileEmailIn, bioInput].forEach((el) =>
    el.setAttribute("disabled", ""),
  );
  editDiv.style.display = "none";
  editProfileBtn.style.display = "block";
  cameraIcon.style.display = "none";
});

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) {
    showToast("Please select a valid image file.", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    profilePic.src = dataUrl;
    headerPic.src = dataUrl;
    const username = localStorage.getItem("sp_currentUser");
    updateUser(username, { avatar: dataUrl });
  };
  reader.readAsDataURL(file);
});

// ── COURSES ────────────────────────────────────────────────────────────────
const addCourseBtnEl = document.querySelector(".add-course-btn");
const courseModal = document.getElementById("addCourseModal");
const saveCourseBtn = document.getElementById("saveCourse");
const cancelCourseBtn = document.getElementById("cancelCourse");
const courseTitleIn = document.getElementById("courseTitleInput");
const courseInstrIn = document.getElementById("courseInstructorInput");
const courseCreditIn = document.getElementById("courseCreditInput");
const semesterSelect = document.getElementById("selectSemester");
const coursesContainer = document.getElementById("coursesContainer");
const semesterFilter = document.getElementById("semesterFilter");
const courseSort = document.getElementById("courseSort");
let editingCourseId = null;

function showCourse() {
  showSection("course-section");
  appHeaderInfo.textContent = "Courses";
  appHeaderText.textContent = "View and manage your courses";
  document.querySelector(".add-course-btn").style.display = "inline-flex";
  renderCourses();
}

function openCourseModal(course = null) {
  editingCourseId = course ? course.id : null;
  courseTitleIn.value = course ? course.title : "";
  courseInstrIn.value = course ? course.instructor : "";
  courseCreditIn.value = course ? course.credits : 3;
  semesterSelect.value = course ? course.semester : "First Semester";
  saveCourseBtn.textContent = course ? "Update Course" : "Add Course";
  document.getElementById("addCourseErrorMessage").textContent = "";
  courseModal.style.display = "flex";
  overlay.style.display = "block";
}

function closeCourseModal() {
  courseModal.style.display = "none";
  overlay.style.display = "none";
  editingCourseId = null;
  saveCourseBtn.textContent = "Add Course";
}

function renderCourses() {
  const courses = getCourses();
  const filter = semesterFilter.value;
  const sortBy = courseSort.value;

  let filtered = courses.filter(
    (c) =>
      filter === "allSemester" ||
      (filter === "firstSemester" &&
        c.semester.toLowerCase().includes("first")) ||
      (filter === "secondSemester" &&
        c.semester.toLowerCase().includes("second")),
  );

  if (sortBy === "title")
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === "credit") filtered.sort((a, b) => a.credits - b.credits);

  if (filtered.length === 0) {
    coursesContainer.innerHTML =
      '<div class="empty-state full-width"><i class="bx bx-book-open"></i><p>No courses found. Click "+ Add Course" to get started.</p></div>';
    return;
  }

  const gradeColors = {
    A: "#10b981",
    B: "#3b82f6",
    C: "#f59e0b",
    D: "#f97316",
    F: "#ef4444",
    "-": "#94a3b8",
  };
  coursesContainer.innerHTML = filtered
    .map((c) => {
      const g = c.grade || "-";
      const gColor = gradeColors[g] || "#94a3b8";
      return `<div class="course-info" data-id="${c.id}">
            <div class="course-header">
                <h3>${c.title}</h3>
                <div class="course-actions">
                    <i class='bx bx-pencil edit-course' title="Edit"></i>
                    <i class='bx bx-trash delete-course' title="Delete"></i>
                </div>
            </div>
            <p class="course-instructor"><i class='bx bx-user'></i> ${c.instructor}</p>
            <div class="course-meta">
                <span><i class='bx bx-bookmark'></i> ${c.credits} Credits</span>
                <span><i class='bx bx-calendar'></i> ${c.semester}</span>
                <span class="course-grade" style="color:${gColor}; border-color:${gColor}20; background:${gColor}15">
                    Grade: ${g}
                </span>
            </div>
        </div>`;
    })
    .join("");

  // Update assignment course selects
  syncCourseSelects();
}

function syncCourseSelects() {
  const courses = getCourses();
  const opts =
    '<option value="">-- Select Course --</option>' +
    courses
      .map((c) => `<option value="${c.title}">${c.title}</option>`)
      .join("");
  document.getElementById("selectCourse").innerHTML = opts;
  const filterOpts =
    '<option value="all">All Courses</option>' +
    courses
      .map(
        (c) => `<option value="${c.title.toLowerCase()}">${c.title}</option>`,
      )
      .join("");
  document.getElementById("selectCourseFilter").innerHTML = filterOpts;
}

addCourseBtnEl.addEventListener("click", () => openCourseModal());

saveCourseBtn.addEventListener("click", () => {
  const title = courseTitleIn.value.trim();
  const instructor = courseInstrIn.value.trim();
  const credits = parseInt(courseCreditIn.value);
  const semester = semesterSelect.value;
  const errEl = document.getElementById("addCourseErrorMessage");

  if (!title || !instructor || !credits || !semester) {
    errEl.textContent = "All fields are required";
    return;
  }
  errEl.textContent = "";

  if (editingCourseId) {
    updateCourse(editingCourseId, { title, instructor, credits, semester });
    showToast("Course updated!", "success");
  } else {
    addCourse({ title, instructor, credits, semester, grade: "-" });
    showToast("Course added!", "success");
  }
  closeCourseModal();
  renderCourses();
  refreshDashboard();
});

cancelCourseBtn.addEventListener("click", closeCourseModal);
semesterFilter.addEventListener("change", renderCourses);
courseSort.addEventListener("change", renderCourses);

coursesContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".course-info");
  if (!card) return;
  const id = card.dataset.id;

  if (e.target.classList.contains("delete-course")) {
    if (confirm("Delete this course?")) {
      deleteCourse(id);
      renderCourses();
      refreshDashboard();
      showToast("Course deleted", "info");
    }
  }
  if (e.target.classList.contains("edit-course")) {
    const course = getCourses().find((c) => c.id === id);
    if (course) openCourseModal(course);
  }
});

// ── ASSIGNMENTS ────────────────────────────────────────────────────────────
const addAssignmentBtnEl = document.querySelector(".add-assignment-btn");
const assignmentModal = document.getElementById("addAssignmentModal");
const saveAssignmentBtn = document.getElementById("saveAssignment");
const cancelAssignmentBtn = document.getElementById("cancelAssignment");
const assignTitleIn = document.getElementById("assignmentTitleInput");
const courseSelectIn = document.getElementById("selectCourse");
const dueDateIn = document.getElementById("dueDate");
const priorityIn = document.getElementById("assignmentPriority");
const assignmentsContainer = document.getElementById("assignmentsContainer");
const courseFilterIn = document.getElementById("selectCourseFilter");
const statusFilterIn = document.getElementById("assignmentStatusFilter");
const submitModal = document.getElementById("submitAssignmentModal");
const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("submit-file-upload-input");
let activeAssignmentId = null;

function showAssignmentSection() {
  showSection("assignment-section");
  appHeaderInfo.textContent = "Assignments";
  appHeaderText.textContent = "Track and submit your assignments";
  document.querySelector(".add-assignment-btn").style.display = "inline-flex";
  renderAssignments();
}

function openAssignmentModal() {
  assignTitleIn.value = "";
  dueDateIn.value = "";
  document.getElementById("assignmentErrorMessage").textContent = "";
  syncCourseSelects();
  assignmentModal.style.display = "flex";
  overlay.style.display = "block";
}

function closeAssignmentModal() {
  assignmentModal.style.display = "none";
  overlay.style.display = "none";
}

function renderAssignments() {
  const assignments = getAssignments();
  const courseFilter = courseFilterIn.value;
  const statusFilter = statusFilterIn.value;

  let filtered = assignments.filter((a) => {
    const courseMatch =
      courseFilter === "all" || a.course.toLowerCase() === courseFilter;
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "submitted" ? a.submitted : !a.submitted);
    return courseMatch && statusMatch;
  });

  if (filtered.length === 0) {
    assignmentsContainer.innerHTML =
      '<div class="empty-state full-width"><i class="bx bx-task"></i><p>No assignments found.</p></div>';
    return;
  }

  const priorityColors = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };

  assignmentsContainer.innerHTML = filtered
    .map((a) => {
      const due = new Date(a.dueDate);
      const today = new Date();
      const diff = Math.ceil((due - today) / 86400000);
      const pColor = priorityColors[a.priority] || "#94a3b8";
      const dueLabel = a.submitted
        ? `<span class="badge-submitted">✓ Submitted</span>`
        : diff < 0
          ? `<span class="badge-overdue">Overdue by ${Math.abs(diff)}d</span>`
          : diff === 0
            ? `<span class="badge-due">Due today!</span>`
            : `<span class="badge-pending">Due in ${diff}d</span>`;

      return `<div class="assignment-info-container ${a.submitted ? "submitted" : ""}" data-id="${a.id}">
            <div class="assignment-info">
                <div class="assignment-info-left">
                    <i class="bx ${a.submitted ? "bx-check-circle" : "bx-task"} ${a.submitted ? "icon-submitted" : "icon-pending"}"></i>
                    <div>
                        <h3>${a.title}</h3>
                        <p>${a.course}</p>
                        <div class="assignment-meta">
                            ${dueLabel}
                            <span class="priority-badge" style="color:${pColor};border-color:${pColor}30;background:${pColor}15">${a.priority}</span>
                        </div>
                        ${a.submitted && a.submittedAt ? `<p class="submitted-time">Submitted: ${new Date(a.submittedAt).toLocaleDateString()}</p>` : ""}
                    </div>
                </div>
                <div class="assignment-right-actions">
                    ${!a.submitted ? `<div class="assignment-info-submit" data-id="${a.id}"><i class='bx bx-upload'></i><p>Submit</p></div>` : '<span class="submitted-label">Submitted</span>'}
                    <i class='bx bx-trash delete-assignment' data-id="${a.id}" title="Delete"></i>
                </div>
            </div>
        </div>`;
    })
    .join("");
}

addAssignmentBtnEl.addEventListener("click", openAssignmentModal);
cancelAssignmentBtn.addEventListener("click", closeAssignmentModal);
courseFilterIn.addEventListener("change", renderAssignments);
statusFilterIn.addEventListener("change", renderAssignments);

saveAssignmentBtn.addEventListener("click", () => {
  const title = assignTitleIn.value.trim();
  const course = courseSelectIn.value;
  const dueDate = dueDateIn.value;
  const priority = priorityIn.value;
  const errEl = document.getElementById("assignmentErrorMessage");

  if (!title || !course || !dueDate) {
    errEl.textContent = "All fields are required";
    return;
  }
  errEl.textContent = "";

  addAssignment({ title, course, dueDate, priority });
  closeAssignmentModal();
  renderAssignments();
  refreshDashboard();
  showToast("Assignment added!", "success");
});

assignmentsContainer.addEventListener("click", (e) => {
  const submitBtn = e.target.closest(".assignment-info-submit");
  if (submitBtn) {
    activeAssignmentId = submitBtn.dataset.id;
    document.getElementById("submitAssignmentName").textContent =
      getAssignments().find((a) => a.id === activeAssignmentId)?.title || "";
    submitModal.style.display = "flex";
    overlay.style.display = "block";
  }
  if (e.target.classList.contains("delete-assignment")) {
    if (confirm("Delete this assignment?")) {
      deleteAssignment(e.target.dataset.id);
      renderAssignments();
      refreshDashboard();
      showToast("Assignment deleted", "info");
    }
  }
});

document
  .getElementById("submitAssignmentUpload")
  .addEventListener("click", () => {
    const file = fileInput.files[0];
    if (!file) {
      showToast("Please upload a file", "error");
      return;
    }
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
    ];
    if (!allowed.includes(file.type)) {
      showToast("Invalid file type. PDF, DOC, DOCX, ZIP only.", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("File exceeds 10MB limit", "error");
      return;
    }
    submitAssignmentById(activeAssignmentId);
    submitModal.style.display = "none";
    overlay.style.display = "none";
    fileInput.value = "";
    uploadBox.innerHTML =
      '<i class="bx bx-cloud-upload"></i><p>Click to Upload File</p><p class="upload-hint">PDF, DOC, DOCX, ZIP (max 10MB)</p>';
    renderAssignments();
    refreshDashboard();
    showToast("Assignment submitted successfully!", "success");
  });

document
  .getElementById("cancelAssignmentUpload")
  .addEventListener("click", () => {
    submitModal.style.display = "none";
    overlay.style.display = "none";
  });

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  uploadBox.innerHTML = `<i class='bx bx-file'></i><p><strong>${file.name}</strong></p><p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>`;
});

// ── GRADES ─────────────────────────────────────────────────────────────────
const GRADE_POINTS = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };

function computeGPA() {
  const courses = getCourses().filter((c) => c.grade && c.grade !== "-");
  if (courses.length === 0) return null;
  let totalPoints = 0,
    totalCredits = 0;
  courses.forEach((c) => {
    const pts = GRADE_POINTS[c.grade] ?? 0;
    totalPoints += pts * c.credits;
    totalCredits += c.credits;
  });
  return totalCredits > 0 ? totalPoints / totalCredits : null;
}

function showGrades() {
  showSection("grades-section");
  appHeaderInfo.textContent = "Grades";
  appHeaderText.textContent = "Track your academic performance";
  renderGrades();
}

function renderGrades() {
  const courses = getCourses();
  const gpa = computeGPA();
  const gpaVal = document.getElementById("gpaValue");
  const gpaLabel = document.getElementById("gpaLabel");
  const gpaInfo = document.getElementById("gradesSemesterInfo");
  const gpaCirc = document.getElementById("gpaCircle");

  gpaVal.textContent = gpa !== null ? gpa.toFixed(2) : "—";
  if (gpa !== null) {
    const label =
      gpa >= 3.5
        ? "First Class"
        : gpa >= 3.0
          ? "Second Class Upper"
          : gpa >= 2.0
            ? "Second Class Lower"
            : "Pass";
    gpaLabel.textContent = label;
    gpaInfo.textContent = `Based on ${courses.filter((c) => c.grade && c.grade !== "-").length} graded courses`;
    gpaCirc.style.borderColor =
      gpa >= 3.5 ? "#10b981" : gpa >= 2.0 ? "#3b82f6" : "#ef4444";
  } else {
    gpaLabel.textContent = "No grades yet";
    gpaInfo.textContent = "Add courses and enter grades below";
  }

  const list = document.getElementById("gradesList");
  if (courses.length === 0) {
    list.innerHTML =
      '<div class="empty-state full-width"><i class="bx bx-medal"></i><p>No courses added yet.</p></div>';
    return;
  }

  list.innerHTML = `<div class="grades-table">
        <div class="grades-table-header">
            <span>Course</span><span>Instructor</span><span>Credits</span><span>Grade</span><span>Points</span>
        </div>
        ${courses
          .map((c) => {
            const g = c.grade || "-";
            const pts =
              GRADE_POINTS[g] !== undefined
                ? (GRADE_POINTS[g] * c.credits).toFixed(1)
                : "—";
            const colors = {
              A: "#10b981",
              B: "#3b82f6",
              C: "#f59e0b",
              D: "#f97316",
              F: "#ef4444",
              "-": "#94a3b8",
            };
            const col = colors[g] || "#94a3b8";
            return `<div class="grades-table-row">
                <span>${c.title}</span>
                <span>${c.instructor}</span>
                <span>${c.credits}</span>
                <span>
                    <select class="grade-select" data-id="${c.id}" style="color:${col}">
                        <option value="-" ${g === "-" ? "selected" : ""}>— Select —</option>
                        ${["A", "B", "C", "D", "F"].map((gr) => `<option value="${gr}" ${g === gr ? "selected" : ""} style="color:${colors[gr]}">${gr}</option>`).join("")}
                    </select>
                </span>
                <span style="color:${col}">${pts}</span>
            </div>`;
          })
          .join("")}
    </div>`;

  list.querySelectorAll(".grade-select").forEach((sel) => {
    sel.addEventListener("change", () => {
      updateCourse(sel.dataset.id, { grade: sel.value });
      renderGrades();
      refreshDashboard();
      showToast("Grade saved!", "success");
    });
  });
}

// ── SETTINGS ───────────────────────────────────────────────────────────────
const modeToggle = document.getElementById("modeToggleContainer");
const modeIcon = document.getElementById("modeIcon");
const modeText = document.getElementById("modeText");
const modeInfo = document.getElementById("modeTextInfo");

function showSettingsSection() {
  showSection("settings-section");
  appHeaderInfo.textContent = "Settings";
  appHeaderText.textContent = "Manage your preferences";
  syncModeUI();
}

function syncModeUI() {
  const isDark = body.classList.contains("dark");
  modeText.textContent = isDark ? "Light Mode" : "Dark Mode";
  modeInfo.textContent = isDark ? "Dark theme enabled" : "Light theme enabled";
  modeIcon.className = isDark ? "bx bx-moon" : "bx bx-sun";
  modeToggle.classList.toggle("active", isDark);
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem(
    "sp_theme",
    body.classList.contains("dark") ? "dark" : "light",
  );
  syncModeUI();
});

document.getElementById("deleteAccountBtn").addEventListener("click", () => {
  if (
    confirm(
      "Are you sure? This will permanently delete your account and all your data.",
    )
  ) {
    const username = localStorage.getItem("sp_currentUser");
    deleteUser(username);
    showToast("Account deleted", "info");
    showLandingPage();
  }
});

document
  .getElementById("changePasswordBtn")
  .addEventListener("click", showResetPasswordSection);

// ── SIDEBAR LINKS ──────────────────────────────────────────────────────────
document
  .getElementById("dashboardLink")
  .addEventListener("click", showDashboard);
document.getElementById("profileLink").addEventListener("click", showProfile);
document.getElementById("courseLink").addEventListener("click", showCourse);
document
  .getElementById("assignmentLink")
  .addEventListener("click", showAssignmentSection);
document.getElementById("gradesLink").addEventListener("click", showGrades);
document
  .getElementById("settingsLink")
  .addEventListener("click", showSettingsSection);
document.getElementById("logoutLink").addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("sp_currentUser");
    showToast("Logged out successfully", "info");
    showLandingPage();
  }
});

// ── OVERLAY CLOSE ──────────────────────────────────────────────────────────
overlay.addEventListener("click", () => {
  courseModal.style.display = "none";
  assignmentModal.style.display = "none";
  submitModal.style.display = "none";
  overlay.style.display = "none";
});
