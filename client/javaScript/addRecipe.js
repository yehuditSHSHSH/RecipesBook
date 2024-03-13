document.getElementById("submit").addEventListener("click", addRecipe);
document.getElementById("wellcome").innerHTML=localStorage.getItem('name');
document.addEventListener("DOMContentLoaded",addIngredients);


function addRecipe() {
    const recipeName = document.getElementById("name").value;
    const preparationInstructions = document.getElementById("preparationInstructions").value;
    const category = document.getElementById("category").value;
    const levelOfDifficulty = document.getElementById("levelOfDifficulty").value;
    const description = document.getElementById("description").value;
    const quantityOfProduce = document.getElementById("quantityOfProduce").value;
    const durationOfPreparation = document.getElementById("durationOfPreparation").value;
    const image = document.getElementById("image-input").files[0];
    if (!image) {
        alert("Please choose a photo to upload.");
        return;
    }

    const recipeData = new FormData();
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
    recipeData.append('likes', 0);
    recipeData.append('category', category);
    recipeData.append('preparationInstructions', preparationInstructions);
    recipeData.append('quantityOfProduce', quantityOfProduce);
    recipeData.append('durationOfPreparation', durationOfPreparation);
    recipeData.append('levelOfDifficulty', levelOfDifficulty);
    recipeData.append('description', description);
    recipeData.append('image', image);
    recipeData.append('creatorID', "");

    const token = localStorage.getItem('token');
    var settings = {
        "url": "http://localhost:3000/recipes",
        "method": "POST",
        "headers": {
            "Authorization": token
        },
        "data": recipeData,
        "processData": false,
        "contentType": false
    }

    $.ajax(settings).done(function (response) {
        const newRecipeId = response._id;
        window.location.href = "../html/recipesBook.html";
    }).fail(function (error) {
        console.log(error);
        return;
    });
}