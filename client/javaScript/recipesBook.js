const myRecipesContainer = document.getElementById("myRecipes-container");

function myRecipes() {
    document.getElementById("wellcome").innerHTML = localStorage.getItem('name');
    const token = localStorage.getItem('token');

    if (token) {
        document.getElementById('myRecipesTab').disabled = true;
        document.getElementById('favoriteRecipesTab').disabled = false;
        document.getElementById('myRecipesTab').style.backgroundColor = "#555";
        document.getElementById('favoriteRecipesTab').style.backgroundColor = "black";

        const addRecipeButton = document.getElementById('addRecipe');
        addRecipeButton.style.display = 'block';


        const myRecipes = document.getElementById("myRecipes-container");
        if (myRecipes) {
            myRecipes.textContent = "";
        }

        var settings = {
            "crossDomain": true,
            "url": `http://localhost:3000/recipes/myRecipes`,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }
        $.ajax(settings).done(async function (response) {
            console.log(response);
            let RecipesContainer = showRecipes(response.recipes, response.user.name, 'myInNoteBook');
            myRecipesContainer.appendChild(RecipesContainer);
            const heartIcons = document.querySelectorAll('.fas.fa-heart');
            heartIcons.forEach(icon => {
                icon.style.color = 'red';
            });
            const recipeThumbnails = document.querySelectorAll(".recipes_imgs");
            recipeThumbnails.forEach(function (thumbnail) {
                thumbnail.addEventListener("click", function () {
                    localStorage.setItem("recipeId", thumbnail.id);
                    window.location.href = "../html/recipesDetails.html";
                });
            });

            const hoverMessages = document.querySelectorAll(".hover-message");

            hoverMessages.forEach((hoverMessage) => {
                hoverMessage.parentNode.removeChild(hoverMessage);
            });

        })
            .fail(function (error) {
                alert("קרתה שגיאה בהצגת המתכונים שלך, הבעיה בטיפול, נסה שנית מאוחר יותר.");
                console.error(error);
            });
    }
    else {
        alert('המשתמש לא מחובר');
        window.history.back();

    }
}

function othersRecipes() {
    document.getElementById('myRecipesTab').disabled = false;
    document.getElementById('favoriteRecipesTab').disabled = true;
    document.getElementById('favoriteRecipesTab').style.backgroundColor = "#555";
    document.getElementById('myRecipesTab').style.backgroundColor = "black";

    const addRecipeButton = document.getElementById('addRecipe');
    addRecipeButton.style.display = 'none';

    const myRecipes = document.getElementById("myRecipes-container");
    if (myRecipes) {
        myRecipes.textContent = "";
    }
    const token = localStorage.getItem('token');

    var settings = {
        "crossDomain": true,
        "url": `http://localhost:3000/recipes/othersRecipes`,
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": token
        }
    }
    $.ajax(settings).done(async function (response) {
        console.log(response);
        let RecipesContainer = showRecipes(response.recipes, null, 'other');
        myRecipesContainer.appendChild(RecipesContainer);
        $(document).ready(function () {
            $('.image-likes i.fas').on('click', removeLike);
        });
        const recipeThumbnails = document.querySelectorAll(".recipes_imgs");
        recipeThumbnails.forEach(function (thumbnail) {
            thumbnail.addEventListener("click", function () {
                localStorage.setItem("recipeId", thumbnail.id);
                window.location.href = "../html/recipesDetails.html";
            });
        });
    })
        .fail(function (error) {
            alert("קרתה שגיאה בהצגת המתכונים ששמרת במחברת המתכונים שלך, הבעיה בטיפול, נסה שנית מאוחר יותר.");
            console.error(error);
        });
}

function removeLike(event) {
    var iconId = event.target.id;
    var settings = {
        "crossDomain": true,
        "url": `http://localhost:3000/users/${iconId}`,
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token')
        }
    }

    $.ajax(settings).done(async function (response) {
        othersRecipes();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 404) {
            alert("מצטערים, קרתה תקלה בהוספת המתכון למשתמש. הבעיה בטיפול.");
        }
        else {
            if (jqXHR.status === 405) {
                alert("אנחנו שמחים שאתה אוהבת את המתכון שלך:) אבל לא ניתן להוסיף אותו לרשימת המתכונים האהובים עליך...");
            }
            else {
                if (jqXHR.status === 406) {
                    alert("אופס! מתכון זה כבר קיים בספר המתכונים שלך!");
                }
            }
        }
        console.error("Error:", errorThrown);
        reject(errorThrown);
    });
}

document.addEventListener("DOMContentLoaded", myRecipes);