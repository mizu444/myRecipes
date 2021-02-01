const main = document.querySelector(".main");
const recipesContainer = document.querySelector(".recipes-container");
const recipesEl = document.querySelectorAll(".recipe");
const modal = document.getElementById("modal");
const close = document.getElementById("close");
const modalTitle = document.getElementById("modalTitle");
const modalIngredients = document.getElementById("modalIngredients");
const modalDirections = document.getElementById("modalDirections");

showRecipes();

async function showRecipes() {
  const response = await fetch("/recipes.json");
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

close.addEventListener("click", () => {
  modal.style.display = "none";
  modalTitle.innerHTML = "";
  modalIngredients.innerHTML = "";
  modalDirections.innerHTML = "";
});
