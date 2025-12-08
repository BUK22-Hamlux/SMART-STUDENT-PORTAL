// storage.js

// Get all users from localStorage
export function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Save a new user
export function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

// Check if username/email already exists
export function userExists(username, email) {
    const users = getUsers();
    return users.some(u => u.username === username || u.email === email);
}
