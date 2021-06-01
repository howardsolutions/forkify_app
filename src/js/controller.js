import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2
// API keys: 8c6e0dce-cf72-4435-9ac8-c24a6b990ee1
///////////////////////////////////////


// RECIPE CONTROLLER
const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; 

    // show spinner
    recipeView.renderSpinner();

    // 1. LOADING RECIPE DATA
    await model.loadRecipe(id);

    // 2. RENDERING Recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    alert(err);
  }
}

const init = () => {
  recipeView.addHandlerRender(controlRecipes)
}

init();