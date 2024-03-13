const recipesContainer = document.getElementById("recipes-container");

function addLike(event) {
    const token = localStorage.getItem('token');
    if (token) {
        var iconId = event.target.id;
        var likesCountElement = $(event.target).next("#likes-count");
        var currentLikesCount = parseInt(likesCountElement.text(), 10);
        var settings = {
            "crossDomain": true,
            "url": `http://localhost:3000/users/othersRecipes/${iconId}`,
            "method": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }

        $.ajax(settings).done(async function (response) {
            var newLikesCount = currentLikesCount + 1;
            likesCountElement.text(newLikesCount);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 404) {
                alert("מצטערים, קרתה תקלה בהוספת המתכון למשתמש. הבעיה בטיפול.");
            }
            else{
                if (jqXHR.status === 405) {
                    alert("אנחנו שמחים שאתה אוהבת את המתכון שלך:) אבל לא ניתן להוסיף אותו לרשימת המתכונים האהובים עליך...");
                }
                else{
                    if (jqXHR.status === 406) {
                        alert("אופס! מתכון זה כבר קיים בספר המתכונים שלך!");
                    }
                }
            }
            console.error("Error:", errorThrown);
        });

    }
    else {
        alert("משתמש לא מחובר! על מנת להוסיף מתכונים שאהבת למחברת המתכונים שלך, יש להתחבר קודם");
    }
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
            window.location.reload();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 404) {
                alert("מצטערים, קרתה תקלה בהוספת המתכון למשתמש. הבעיה בטיפול.");
            }
            else{
                if (jqXHR.status === 405) {
                    alert("אנחנו שמחים שאתה אוהבת את המתכון שלך:) אבל לא ניתן להוסיף אותו לרשימת המתכונים האהובים עליך...");
                }
                else{
                    if (jqXHR.status === 406) {
                        alert("אופס! מתכון זה כבר קיים בספר המתכונים שלך!");
                    }
                }
            }
            console.error("Error:", errorThrown);
        });
}

function getRecipesByCategory() {
    category = localStorage.getItem('category')
    localStorage.removeItem('category');
    console.log(category)
    var settings = {
        "crossDomain": true,
        "url": `http://localhost:3000/recipes/?category=${category}`,
        "method": "GET",
        "Content-Type": "application/json"
    }

    console.log(settings);

    $.ajax(settings).done(async function (response) {
        console.log(response);
        for (const recipe of response) {
            console.log(recipe)
            const recipeElement = document.createElement("div");
            recipeElement.innerHTML = `
                <p>נכתב על ידי: ${recipe.creatorName}</p>
                <p>רמת קושי: ${recipe.levelOfDifficulty}</p>
                <div class="image-with-caption">
                <a href="../html/recipesDetails.html"> <img src="${'http://localhost:3000/'+recipe.image}" alt="${recipe.name}" class="recipes_imgs" id="${recipe._id}" > </a>         
                    <span class="image-likes">
                    <i class="fas fa-heart" id="${recipe._id}"></i>
                    <span id="likes-count">${recipe.likes}</span>
                    <div class="hover-message">בלחיצה על לייק, אתה מוסיף מתכון זה למחברת המתכונים שלך</div>
                    </span>
                    <span class="image-caption">${recipe.name}</span>
                </div>
                <p>${recipe.description}</p>

            `;
            recipesContainer.appendChild(recipeElement);
        }

        $(document).ready(function () {
            $('.image-likes i.fas').on('click', addLike);
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
            alert("אופס, קרתה תקלה בטעינת המתכונים, נסה שוב מאוחר יותר.");
            console.error(error);
        });

}

document.addEventListener("DOMContentLoaded", getRecipesByCategory);
