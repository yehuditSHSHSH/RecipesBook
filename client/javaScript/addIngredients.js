function addIngredients()
{
    const addIngredientButton = document.getElementById("addIngredientButton");
    const ingredientsList = document.getElementById("ingredientsList");

    addIngredientButton.addEventListener("click", function () {
        // יצירת תיבות הטקסט להוספת רכיב
        const ingredientDiv = document.createElement("div");
        ingredientDiv.classList.add("ingredient");

        const ingredientNameInput = document.createElement("input");
        ingredientNameInput.type = "text";
        ingredientNameInput.classList.add("ingredient-name");
        ingredientNameInput.placeholder = "שם הרכיב";

        const ingredientQuantityInput = document.createElement("input");
        ingredientQuantityInput.type = "number";
        ingredientQuantityInput.classList.add("ingredient-quantity");
        ingredientQuantityInput.placeholder = "כמות";

        const ingredientQuantityTypeInput = document.createElement("input");
        ingredientQuantityTypeInput.type = "text";
        ingredientQuantityTypeInput.classList.add("ingredient-quantity-type");
        ingredientQuantityTypeInput.placeholder = "סוג יחידה";

        // הוספת התיבות לרשימת הרכיבים
        ingredientDiv.appendChild(ingredientNameInput);
        ingredientDiv.appendChild(ingredientQuantityInput);
        ingredientDiv.appendChild(ingredientQuantityTypeInput);
        ingredientsList.appendChild(ingredientDiv);
    });
}