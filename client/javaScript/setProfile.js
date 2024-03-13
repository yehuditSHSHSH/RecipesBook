function setProfile() {
    const token = localStorage.getItem('token');
    document.getElementById("wellcome").innerHTML=localStorage.getItem('name');
    if (token) {

        var settings = {
            "url": "http://localhost:3000/users/getUserByID",
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }
        
        $.ajax(settings).done(function (response) {
            const user = response;
            document.getElementById('register-name').value = user.name;
            document.getElementById('login-email').value = user.email;
            document.getElementById('login-password').value = user.password;
            document.getElementById('register-description').value = user.description;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 404) {
                alert("המשתמש שמחובר לא נמצא,מצטערים על התקלה, היא בטיפול. נסה שנית ")
            }
            console.error("Error:", errorThrown);
        });
    }
    else {
        alert('המשתמש לא מחובר');
        window.history.back();
    }
}

function updateUser() {

    let name = document.getElementById('register-name').value;
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;
    let description = document.getElementById('register-description').value;

    var settings = {
        "url": "http://localhost:3000/users",
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token')
        },
        "data": JSON.stringify({
            "name": name,
            "email": email,
            "password": password,
            "description": description
        }),
    }

    $.ajax(settings).done(function (response) {
        localStorage.setItem("token", response.token);
        window.location.href = "../html/homePage.html";
    }).fail(
        function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400) {
                alert("מייל זה כבר קיים, הקש מייל אחר.");
            }
            else {
                console.log(jqXHR.status);
            }
            console.error("Error:", errorThrown);
        });
}

document.addEventListener("DOMContentLoaded", setProfile);