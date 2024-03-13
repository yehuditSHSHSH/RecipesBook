function login() {
    console.log("login")
    let email = document.querySelector("#login-email").value;
    let password = document.querySelector("#login-password").value;
    var settings = {
        "url": "http://localhost:3000/users/login",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({

            "email": email,
            "password": password
        }),
    };
    return new Promise((resolve, reject) => {
        $.ajax(settings).done(function (response) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("name", response.user.name);
            window.location.href = "../html/homePage.html";
            resolve(response.user);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 405) {
                alert("סיסמה שגויה");
            }
            if (jqXHR.status === 404) {
                alert("לא נמצא משתמש עבור האימייל שהוקש, נסה שוב!");
            }
            console.error("Error:", errorThrown);
            reject(errorThrown);
        });
    });
}