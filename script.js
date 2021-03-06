const main = document.querySelector(".main");
const search = document.querySelector(".search");
const recipesContainer = document.querySelector(".recipes-container");
const recipesEl = document.querySelectorAll(".recipe");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const closeAddFormBtn = document.getElementById("close-add-form-btn");
const closeEditFormBtn = document.getElementById("close-edit-form-btn");
const modalTitle = document.getElementById("modalTitle");
const modalIngredients = document.getElementById("modalIngredients");
const modalDirections = document.getElementById("modalDirections");
const addNewBtn = document.getElementById("add-new-btn");
const addForm = document.getElementById("add-form");
const editForm = document.getElementById("edit-form");
const inputs = document.querySelectorAll(".input");
const ingredientsList = document.querySelector(".ingredients-list");
const errorEl = document.getElementById("error-message");
const editErrorEl = document.getElementById("edit-error-message");
const editTitle = document.getElementById("edit-title");
const editImg = document.getElementById("edit-img");
const editDirections = document.getElementById("edit-directions");
const editIngredients = document.getElementById("edit-ingredients");
let originalTitle;

showRecipes();

async function showRecipes() {
  recipesContainer.innerHTML = "";
  // const response = await fetch("/recipes.json");
  const response = await fetch("http://localhost:8080/recipes/index.php");
  const data = await response.json();

  data.recipes.forEach(createRecipeEl);
}

search.addEventListener("keyup", searchRecipe);

function searchRecipe(e) {
  [...recipesContainer.children].forEach((recipeEl) => {
    const title = recipeEl.querySelector(".title").innerText;
    if (title.toLowerCase().includes(e.target.value.toLowerCase())) {
      recipeEl.style.display = "block";
    } else {
      recipeEl.style.display = "none";
    }
  });
}

function createRecipeEl(recipe) {
  const recipeEl = document.createElement("div");
  recipeEl.classList.add("recipe");

  recipeEl.innerHTML = `
    <h3 class="title">${recipe.title}</h3>
    <img src="${recipe.image}"
    alt=""/>
    <i class="fas fa-trash-alt delete"></i>
    <i class="fas fa-pencil-alt edit"></i>
  `;

  const recipeTitle = recipeEl.querySelector(".title");

  recipesContainer.appendChild(recipeEl);

  recipeTitle.addEventListener("click", () => {
    showModal(recipe);
  });

  const deleteBtn = recipeEl.querySelector(".delete");
  const editBtn = recipeEl.querySelector(".edit");

  deleteBtn.addEventListener("click", () => {
    deleteRecipe(recipeEl);
  });
  editBtn.addEventListener("click", () => {
    editRecipe(recipe);
  });
}

closeEditFormBtn.addEventListener("click", closeEditForm);

function closeEditForm() {
  editForm.style.display = "none";
  inputs.forEach((input) => (input.value = ""));
}

function editRecipe(recipe) {
  originalTitle = recipe.title;
  editForm.style.display = "block";
  editTitle.value = recipe.title;
  editImg.value = recipe.image;
  editDirections.value = recipe.directions;
  recipe.ingredients.forEach((ingredient) => {
    createIngredient(true, ingredient);
  });
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let error = false;
  const titleEl = document.getElementById("edit-title");
  const imgEl = document.getElementById("edit-img");
  const directionsEl = document.getElementById("edit-directions");
  const list = [...editIngredients.children];
  titleEl.classList.remove("error");
  directionsEl.classList.remove("error");
  list.forEach((ingredientContainer) => {
    ingredientContainer.children[0].classList.remove("error");
  });

  const title = titleEl.value.trim();
  const directions = directionsEl.value.trim();
  const image = imgEl.value.trim() || null;

  if (title.length === 0) {
    titleEl.classList.add("error");
    error = true;
  }

  if (directions.length === 0) {
    directionsEl.classList.add("error");
    error = true;
  }

  editErrorEl.innerText = "";

  const editedIngredients = [];
  list.forEach((ingredientContainer) => {
    const ingredientValue = ingredientContainer.children[0].value.trim();
    if (ingredientValue) {
      editedIngredients.push(ingredientValue);
    }
  });

  if (editedIngredients.length === 0) {
    list.forEach((ingredientContainer) => {
      ingredientContainer.children[0].classList.add("error");
      error = true;
    });
  }

  if (error) {
    errorEl.innerText = "ta vypln sicko co mas!";
    return;
  }

  const editedRecipe = {
    title,
    ingredients: editedIngredients,
    directions,
    image,
  };

  fetch("http://localhost:8080/recipes/index.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({ ...editedRecipe, originalTitle }),
  })
    .then((response) => {
      if (!response.ok) {
        throw "Nastala chyba, skuste znova neskor.";
      }
      closeEditForm();
      showRecipes();
    })
    .catch((error) => {
      editErrorEl.innerText = error;
    });

  // console.log(editedRecipe);
});

function deleteRecipe(recipeEl) {
  const result = confirm("Do you really want to delete this recipe?");
  if (result) {
    // recipeEl.remove();
    const title = recipeEl.querySelector(".title");
    // console.log(title.innerText)
    fetch("http://localhost:8080/recipes/index.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({ title: title.innerText }),
    })
      .then((response) => {
        if (!response.ok) {
          throw "Nastala chyba, skuste znova neskor.";
        }
        // closeForm();
        showRecipes();
      })
      .catch((error) => {
        alert(error);
      });
  }
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
  const imgEl = document.getElementById("input-img");
  const directionsEl = document.getElementById("input-directions");
  const list = [...ingredientsList.children];
  titleEl.classList.remove("error");
  directionsEl.classList.remove("error");
  list.forEach((ingredientContainer) => {
    ingredientContainer.children[0].classList.remove("error");
  });

  const title = titleEl.value.trim();
  const directions = directionsEl.value.trim();
  const image = imgEl.value.trim() || null;

  if (title.length === 0) {
    titleEl.classList.add("error");
    error = true;
  }

  if (directions.length === 0) {
    directionsEl.classList.add("error");
    error = true;
  }

  errorEl.innerText = "";

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
    errorEl.innerText = "ta vypln sicko co mas!";
    return;
  }

  const newRecipe = {
    title,
    ingredients: addedIngredients,
    directions,
    image,
  };

  fetch("http://localhost:8080/recipes/index.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams(newRecipe),
  })
    .then((response) => {
      if (!response.ok) {
        throw "Nastala chyba, skuste znova neskor.";
      }
      closeForm();
      showRecipes();
    })
    .catch((error) => {
      errorEl.innerText = error;
    });
});

createIngredient();

closeModalBtn.addEventListener("click", closeModal);
closeAddFormBtn.addEventListener("click", closeForm);

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

function updateList(list) {
  const currentList = [...list.children];
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

function createIngredient(edit = false, value = "") {
  let list;
  if (edit) {
    list = editIngredients;
  } else {
    list = ingredientsList;
  }

  const newIngrContainer = document.createElement("div");
  newIngrContainer.classList.add("ingredient-container");

  const removeButton = document.createElement("span");
  removeButton.classList.add("remove-ingredient");
  const removeIcon = document.createElement("i");
  removeIcon.classList = "fas fa-times";
  removeButton.appendChild(removeIcon);
  removeButton.addEventListener("click", () => {
    if (list.children.length === 1) {
      return;
    }
    list.removeChild(newIngrContainer);

    updateList(list);
  });

  newIngrContainer.innerHTML = `
            <input
              type="text"
              class="input ingredients"
              placeholder="Enter ingredient"
              value="${value}"
              />
  `;
  newIngrContainer.appendChild(removeButton);
  list.appendChild(newIngrContainer);
  updateList(list);
}
