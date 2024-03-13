function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.href = "../html/homePage.html";
}
  