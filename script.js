const main = document.querySelector(".main");
const search = document.querySelector(".search");
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
const ingredientsList = document.querySelector(".ingredients-list");

showRecipes();

async function showRecipes() {
  const response = await fetch("/recipes.json");
  // const response = await fetch("http://localhost:8080/recipes/index.php");
  const data = await response.json();

  data.recipes.forEach(createRecipeEl);
}

search.addEventListener("keydown", searchRecipe);

function searchRecipe(e) {
  // console.log(e.target.value);
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
  let error = false;
  const titleEl = document.getElementById("input-title");
  const directionsEl = document.getElementById("input-directions");
  const list = [...ingredientsList.children];
  titleEl.classList.remove("error");
  directionsEl.classList.remove("error");
  list.forEach((ingredientContainer) => {
    ingredientContainer.children[0].classList.remove("error");
  });

  const title = titleEl.value.trim();
  const directions = directionsEl.value.trim();

  if (title.length === 0) {
    titleEl.classList.add("error");
    error = true;
  }

  if (directions.length === 0) {
    directionsEl.classList.add("error");
    error = true;
  }

  const addedIngredients = [];
  list.forEach((ingredientContainer) => {
    const ingredientValue = ingredientContainer.children[0].value.trim();
    if (ingredientValue) {
      addedIngredients.push(ingredientValue);
    }
  });

  if (addedIngredients.length === 0) {
    list.forEach((ingredientContainer) => {
      ingredientContainer.children[0].classList.add("error");
      error = true;
    });
  }

  if (error) {
    console.log("prazdne policka");
    return;
  }

  const newRecipe = {
    title: title,
    ingredients: addedIngredients,
    directions: directions,
  };

  console.log(newRecipe);
});

createIngredient();

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

function updateList() {
  const currentList = [...ingredientsList.children];
  currentList.forEach((ingredient, idx) => {
    if (currentList.length - 1 === idx) {
      let addButton = ingredient.querySelector(".plus-ingredient");
      if (addButton) {
        return;
      }
      addButton = document.createElement("span");
      addButton.classList.add("plus-ingredient");
      const icon = document.createElement("i");
      icon.classList = "fas fa-plus-circle";
      addButton.appendChild(icon);
      addButton.addEventListener("click", createIngredient);
      ingredient.appendChild(addButton);
    } else {
      const addButton = ingredient.querySelector(".plus-ingredient");
      if (addButton) {
        ingredient.removeChild(addButton);
      }
    }
  });
}

function createIngredient() {
  const newIngrContainer = document.createElement("div");
  newIngrContainer.classList.add("ingredient-container");

  const removeButton = document.createElement("span");
  removeButton.classList.add("remove-ingredient");
  const removeIcon = document.createElement("i");
  removeIcon.classList = "fas fa-times";
  removeButton.appendChild(removeIcon);
  removeButton.addEventListener("click", () => {
    if (ingredientsList.children.length === 1) {
      return;
    }
    ingredientsList.removeChild(newIngrContainer);

    updateList();
  });

  newIngrContainer.innerHTML = `
            <input
              type="text"
              class="input ingredients"
              placeholder="Enter ingredient"
              />
  `;
  newIngrContainer.appendChild(removeButton);
  ingredientsList.appendChild(newIngrContainer);
  updateList();
}
