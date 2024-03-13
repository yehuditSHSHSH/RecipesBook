const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    console.log("Search triggered:", searchInput.value);
    search(searchInput.value);
  }
});

searchButton.addEventListener("click", function () {
  console.log("Search button clicked:", searchInput.value);
  search(searchInput.value);
});

function search(searchValue) {
  var settings = {
    "crossDomain": true,
    "url": `http://localhost:3000/users/?name=${searchValue}`,
    "method": "GET"
  }
  $.ajax(settings).done(function (response) {
    const users = response.usersWithRecipes;
    showUsers(users);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status === 404) {
      var settings = {
        "crossDomain": true,
        "url": `http://localhost:3000/recipes/?name=${searchValue}`,
        "method": "GET"
      }
      $.ajax(settings).done(function (response) {
        document.getElementById("main").textContent = " ";
        const recipes = response;
        let RecipesContainer = showRecipes(recipes, null, 'other');
        document.getElementById("main").appendChild(RecipesContainer);
        const recipeThumbnails = document.querySelectorAll(".recipes_imgs");
        recipeThumbnails.forEach(function (thumbnail) {
          thumbnail.addEventListener("click", function () {
            localStorage.setItem("recipeId", thumbnail.id);
            window.location.href = "../html/recipesDetails.html";
          });
        });
      }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 404) {
          alert("לא נמצאו יוצרים ומתכונים, התואמים את החיפוש");
        }
        console.error("Error:", errorThrown);
      });
    }
    console.error("Error:", errorThrown);
  });


}

function showUsers(users) {

  document.getElementById("main").textContent = " ";
  var searchContainerElement = document.createElement("div");
  searchContainerElement.id = "search";

  for (const userWithRecipe of users) {
    let userElement = document.createElement("div");
    userElement.innerHTML = `
  <h1>שם היוצר: ${userWithRecipe.user.name}</h1>
  <h2>תיאור: ${userWithRecipe.user.description}</h2>
  `;
    searchContainerElement.appendChild(userElement);
    let RecipesContainer = showRecipes(userWithRecipe.recipes, userWithRecipe.user.name, 'my');
    searchContainerElement.appendChild(RecipesContainer);
  }
  document.getElementById("main").appendChild(searchContainerElement);
  const recipeThumbnails = document.querySelectorAll(".recipes_imgs");
  recipeThumbnails.forEach(function (thumbnail) {
    thumbnail.addEventListener("click", function () {
      localStorage.setItem("recipeId", thumbnail.id);
      window.location.href = "../html/recipesDetails.html";
    });
  });
}