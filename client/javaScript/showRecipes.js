function showRecipes(recipes, creatorName, myOrOther) {
    const myRecipesContainer = document.createElement("div");
    myRecipesContainer.id = 'recipes-container';
    for (const recipe of recipes) {
        if (myOrOther == 'other') {
            creatorName = recipe.creatorName;
        }
        const recipeElement = document.createElement("div");
        recipeElement.classList.add('icon-container');
        recipeElement.innerHTML = `
            <h2 class="creator">נכתב על ידי: ${creatorName}</h2>
            <p>רמת קושי: ${recipe.levelOfDifficulty}</p>
            <br>
            <div class="image-with-caption">
            <a href="../html/recipesDetails.html"> <img src="${'http://localhost:3000/' + recipe.image}" alt="${recipe.name}" class="recipes_imgs" id="${recipe._id}" > </a>         
            <span class="image-likes">
            <i class="fas fa-heart" id="${recipe._id}"></i>
            <span id="likes-count">${recipe.likes}</span>
            <div class="hover-message">בלחיצה על לייק, אתה מסיר מתכון זה ממחברת המתכונים שלך</div>
            </span>
                <span class="image-caption">${recipe.name}</span>
            </div>
            <p>${recipe.description}</p>

        `;
        if (myOrOther == 'myInNoteBook') {
            const iconElement = addUpdateIcon(recipe._id);
            recipeElement.appendChild(iconElement);
        }
        myRecipesContainer.appendChild(recipeElement);
    }
    return myRecipesContainer;
}

function addUpdateIcon(recipeId) {
    const iconElement = document.createElement("i");
    iconElement.className = "fas fa-pencil-alt";
    iconElement.classList.add('icon-element');
    iconElement.id = recipeId;
    iconElement.style.fontSize = "20px";

    iconElement.addEventListener("click", function () {
        localStorage.setItem("recipeId", iconElement.id);
        window.location.href = "../html/updateRecipe.html"
    });
    iconElement.addEventListener("mouseenter", function () {
        iconElement.style.color = "rgb(241, 71, 139)";
    });
    iconElement.addEventListener("mouseleave", function () {
        iconElement.style.color = "";
    });
    return iconElement;
}