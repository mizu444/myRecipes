const recipes = document.querySelectorAll(".recipe");
const modal = document.getElementById("modal");
const close = document.getElementById("close");

recipes.forEach((recipe, idx) => {
    recipe.children[0].addEventListener("click", showModal)
});

function showModal() {
  modal.style.display = "block";
}

close.addEventListener("click", hideModal);

function hideModal() {
        modal.style.display = "none";
}
