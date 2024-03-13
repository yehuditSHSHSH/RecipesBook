function addUser() {

    let name = document.getElementById('register-name').value;
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;
    let description = document.getElementById('register-description').value;

    var settings = {
        "url": "http://localhost:3000/users",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "name": name,
            "email": email,
            "password": password,
            "description": description
        }),
    }
    console.log(settings);
    $.ajax(settings)
        .done(async function (response) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("name", response.user.name);
            window.location.href = "../html/homePage.html";
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status);
            if (jqXHR.status === 400) {
                alert("הקש מייל שאינו קיים במערכת, ההוספה נכשלה");
            } else {
                console.error("Error:", errorThrown);
            }
        });

}