const recipeThumbnails = document.querySelectorAll(".category img");
recipeThumbnails.forEach(function (thumbnail) {
    thumbnail.addEventListener("click", function () {
        localStorage.setItem("category", thumbnail.id);
        window.location.href = "../html/recipes.html";
    });
});
