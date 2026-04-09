// ── USERS ──────────────────────────────────────────────────────────────────
function getUsers() {
  return JSON.parse(localStorage.getItem("sp_users")) || [];
}
function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("sp_users", JSON.stringify(users));
}
function userExists(email, username) {
  const users = getUsers();
  return users.some((u) => u.email === email || u.username === username);
}
function validateLogin(username, password) {
  const users = getUsers();
  return (
    users.find((u) => u.username === username && u.password === password) ||
    null
  );
}
function getCurrentUser() {
  const username = localStorage.getItem("sp_currentUser");
  if (!username) return null;
  return getUsers().find((u) => u.username === username) || null;
}
function updateUser(username, updates) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem("sp_users", JSON.stringify(users));
  }
}
function deleteUser(username) {
  const users = getUsers().filter((u) => u.username !== username);
  localStorage.setItem("sp_users", JSON.stringify(users));
  localStorage.removeItem("sp_currentUser");
}

// ── COURSES ────────────────────────────────────────────────────────────────
function getCourses() {
  const user = localStorage.getItem("sp_currentUser");
  return JSON.parse(localStorage.getItem(`sp_courses_${user}`)) || [];
}
function saveCourses(courses) {
  const user = localStorage.getItem("sp_currentUser");
  localStorage.setItem(`sp_courses_${user}`, JSON.stringify(courses));
}
function addCourse(course) {
  const courses = getCourses();
  course.id = "course_" + Date.now();
  courses.push(course);
  saveCourses(courses);
  return course;
}
function deleteCourse(id) {
  saveCourses(getCourses().filter((c) => c.id !== id));
}
function updateCourse(id, updates) {
  const courses = getCourses();
  const idx = courses.findIndex((c) => c.id === id);
  if (idx !== -1) courses[idx] = { ...courses[idx], ...updates };
  saveCourses(courses);
}

// ── ASSIGNMENTS ────────────────────────────────────────────────────────────
function getAssignments() {
  const user = localStorage.getItem("sp_currentUser");
  return JSON.parse(localStorage.getItem(`sp_assignments_${user}`)) || [];
}
function saveAssignments(assignments) {
  const user = localStorage.getItem("sp_currentUser");
  localStorage.setItem(`sp_assignments_${user}`, JSON.stringify(assignments));
}
function addAssignment(assignment) {
  const assignments = getAssignments();
  assignment.id = "asgn_" + Date.now();
  assignment.submitted = false;
  assignment.submittedAt = null;
  assignments.push(assignment);
  saveAssignments(assignments);
  return assignment;
}
function deleteAssignment(id) {
  saveAssignments(getAssignments().filter((a) => a.id !== id));
}
function submitAssignmentById(id) {
  const assignments = getAssignments();
  const idx = assignments.findIndex((a) => a.id === id);
  if (idx !== -1) {
    assignments[idx].submitted = true;
    assignments[idx].submittedAt = new Date().toISOString();
  }
  saveAssignments(assignments);
}
