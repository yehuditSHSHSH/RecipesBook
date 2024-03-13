function getRecipeDetails() {
  const recipeId = localStorage.getItem("recipeId");
  var settings = {
    "crossDomain": true,
    "url": `http://localhost:3000/recipes/?RecipeId=${recipeId}`,
    "method": "GET",
    "dataType": "json",
    "headers": {
      "Content-Type": "application/json"
    },

  }
  return new Promise((resolve, reject) => {
    $.ajax(settings).done(function (response) {
      console.log(response);
      const recipe = response;
      const recipeElement = document.createElement("div");
      recipeElement.classList.add("recipe");
      recipeElement.innerHTML = `
          <h1 class="recipe-title">${recipe.name}</h1>
          <h2>${recipe.description}</h2>
          <h2>קטגוריה: ${recipe.category}</h2>
          <h2>כמות לייצור: ${recipe.quantityOfProduce} יחידות&emsp;&emsp;&emsp;|&emsp;&emsp;&emsp;זמן הכנה בדקות: ${recipe.durationOfPreparation}&emsp;&emsp;&emsp;|&emsp;&emsp;&emsp;רמת קושי: ${recipe.levelOfDifficulty}</h2>
          <br>
          <img src="${'http://localhost:3000/' + recipe.image}" alt="${recipe.name}" class="recipe-image">
          <h2>רכיבים:</h2>
          <ul class="recipe-ingredients">
            ${recipe.ingredients
           .filter(ingredient => ingredient)
           .map((ingredient) => `
           <li>  ${ingredient.quantity || ''} ${ingredient.quantityType || ''} ${ingredient.name || ''} </li>
           `).join('')}
          </ul>
          <h2>הוראות הכנה:</h2>
          <br>
          <p class="recipe-instructions">
            ${recipe.preparationInstructions.split(/\d+\./).filter(Boolean).map((instruction) => `
            <li>${instruction}.</li>
              `).join('<br>')}
           </p>
           <div class="left-align">בתאבון:)</div>`;

      const recipeDetails = document.getElementById("recipe-details");
      recipeDetails.appendChild(recipeElement);

    }).fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 404) {
        alert("מצטערים, קרתה תקלה בהצגת המתכון. הבעיה בטיפול.");
      }
      console.error("Error:", errorThrown);
      reject(errorThrown);
    });
  });
}
document.addEventListener("DOMContentLoaded", getRecipeDetails);