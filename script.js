const main = document.querySelector(".main");
const recipesContainer = document.querySelector(".recipes-container");
const recipesEl = document.querySelectorAll(".recipe");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const closeFormBtn = document.getElementById("close-form-btn");
const modalTitle = document.getElementById("modalTitle");
const modalIngredients = document.getElementById("modalIngredients");
const modalDirections = document.getElementById("modalDirections");
const addNewBtn = document.getElementById("add-new-btn");
const addForm = document.getElementById("add-form");
const inputs = document.querySelectorAll(".input");

showRecipes();

async function showRecipes() {
  const response = await fetch("/recipes.json");
  // const response = await fetch("http://localhost:8080/recipes/index.php");
  const data = await response.json();

  data.recipes.forEach(createRecipeEl);
}

function createRecipeEl(recipe) {
  const recipeEl = document.createElement("div");
  recipeEl.classList.add("recipe");

  recipeEl.innerHTML = `
    <h3 class="title">${recipe.title}</h3>
    <img src="${recipe.image}"
    alt=""/>
  `;

  recipesContainer.appendChild(recipeEl);

  recipeEl.addEventListener("click", () => {
    showModal(recipe);
  });
}

function showModal(recipe) {
  modalTitle.innerText = recipe.title;

  const ingredientsEl = recipe.ingredients.map((ingredient) => {
    const ingredientEl = document.createElement("li");
    ingredientEl.innerText = ingredient;
    return ingredientEl;
  });

  ingredientsEl.forEach((ingredientEl) =>
    modalIngredients.appendChild(ingredientEl)
  );

  modalDirections.innerText = recipe.directions;

  modal.style.display = "block";
}

addNewBtn.addEventListener("click", () => (addForm.style.display = "block"));
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

closeModalBtn.addEventListener("click", closeModal);
closeFormBtn.addEventListener("click", closeForm);

function closeModal() {
  modal.style.display = "none";
  modalTitle.innerHTML = "";
  modalIngredients.innerHTML = "";
  modalDirections.innerHTML = "";
}

function closeForm() {
  addForm.style.display = "none";
  inputs.forEach((input) => (input.value = ""));
}
