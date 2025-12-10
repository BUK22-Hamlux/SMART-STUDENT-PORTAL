export function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

export function userExists(email, username) {
    const users = getUsers();
    return users.some(u => u.email === email || u.username === username);
}

export function validateLogin(username, password) {
    const users = getUsers();
    return users.find(u => u.username === username && u.password === password);
}
