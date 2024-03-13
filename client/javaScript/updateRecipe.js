document.addEventListener("DOMContentLoaded", setRecipe);
addIngredients();
function setRecipe() {
    const token = localStorage.getItem('token');
    const recipeId = localStorage.getItem('recipeId');
    document.getElementById("wellcome").innerHTML=localStorage.getItem('name');

    var settings = {
        "url": `http://localhost:3000/recipes/?RecipeId=${recipeId}`,
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": token
        }
    }

    $.ajax(settings).done(function (response) {

        const recipeData = response;
        console.log(recipeData.name)
        document.getElementById("name").value = recipeData.name;
        document.getElementById("category").value = recipeData.category;
        document.getElementById("preparationInstructions").value = recipeData.preparationInstructions;
        document.getElementById("quantityOfProduce").value = recipeData.quantityOfProduce;
        document.getElementById("durationOfPreparation").value = recipeData.durationOfPreparation;
        document.getElementById("levelOfDifficulty").value = recipeData.levelOfDifficulty;
        document.getElementById("description").value = recipeData.description;

        const ingredientsList = document.getElementById("ingredientsList");
        recipeData.ingredients.forEach(function (ingredient) {
            const ingredientDiv = document.createElement("div");
            ingredientDiv.classList.add("ingredient");

            const ingredientNameInput = document.createElement("input");
            ingredientNameInput.type = "text";
            ingredientNameInput.classList.add("ingredient-name");
            ingredientNameInput.value = ingredient.name;

            const ingredientQuantityInput = document.createElement("input");
            ingredientQuantityInput.type = "number";
            ingredientQuantityInput.classList.add("ingredient-quantity");
            ingredientQuantityInput.value = ingredient.quantity;

            const ingredientQuantityTypeInput = document.createElement("input");
            ingredientQuantityTypeInput.type = "text";
            ingredientQuantityTypeInput.classList.add("ingredient-quantity-type");
            ingredientQuantityTypeInput.value = ingredient.quantityType; 

            ingredientDiv.appendChild(ingredientNameInput);
            ingredientDiv.appendChild(ingredientQuantityInput);
            ingredientDiv.appendChild(ingredientQuantityTypeInput);
            ingredientsList.appendChild(ingredientDiv);
        });

        const imageElement = document.getElementById("image-input");
        const imageDisplayElement = document.getElementById("image-display");
        imageDisplayElement.src = 'http://localhost:3000/'+recipeData.image
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 404) {
            alert("המשתמש שמחובר לא נמצא,מצטערים על התקלה, היא בטיפול. נסה שנית ")
        }
        console.error("Error:", errorThrown);
    });

}

function updateRecipe() {
    const recipeId = localStorage.getItem('recipeId');
    localStorage.removeItem('recipeId');
    const recipeName = document.getElementById("name").value;
    const preparationInstructions = document.getElementById("preparationInstructions").value;
    const category = document.getElementById("category").value;
    const levelOfDifficulty = document.getElementById("levelOfDifficulty").value;
    const description = document.getElementById("description").value;
    const quantityOfProduce = document.getElementById("quantityOfProduce").value;
    const durationOfPreparation = document.getElementById("durationOfPreparation").value;
    const image = document.getElementById("image-input").files[0];

    const recipeData = new FormData();
    if (image) {
        recipeData.append('image', image);
    }

    const ingredientElements = document.querySelectorAll(".ingredient");
    ingredientElements.forEach(function (ingredientElement, index) {
        const ingredientName = ingredientElement.querySelector(".ingredient-name").value;
        const ingredientQuantity = ingredientElement.querySelector(".ingredient-quantity").value;
        const ingredientQuantityType = ingredientElement.querySelector(".ingredient-quantity-type").value;

        recipeData.append(`ingredients[${index}][name]`, ingredientName);
        recipeData.append(`ingredients[${index}][quantity]`, ingredientQuantity);
        recipeData.append(`ingredients[${index}][quantityType]`, ingredientQuantityType);
    });

    recipeData.append('name', recipeName);
    recipeData.append('category', category);
    recipeData.append('preparationInstructions', preparationInstructions);
    recipeData.append('quantityOfProduce', quantityOfProduce);
    recipeData.append('durationOfPreparation', durationOfPreparation);
    recipeData.append('levelOfDifficulty', levelOfDifficulty);
    recipeData.append('description', description);

    const token = localStorage.getItem('token');

    var settings = {
        "url": `http://localhost:3000/recipes/${recipeId}`,
        "method": "PUT",
        "headers": {
            "Authorization": token,

        },
        "data": recipeData,
        "processData": false,
        "contentType": false
    };

    $.ajax(settings).done(function (response) {
        window.location.href = "../html/recipesBook.html";
    }).fail(function (error) {
        console.log(error);
        alert(`שגיאה בעדכון המתכון`);
    });
}