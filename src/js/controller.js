import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';

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
    recipeView.renderError();
  }
}

// SEARCH control
const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    // get term from Search VIEW
    const term = searchView.getTerm();
    if (!term) return;
    
    // pass the term => model => load search result (ALL results)
    await model.loadSearchResults(term);

    // render results PER PAGE (10 per page)
    resultsView.render(model.getSearchResultsPage())

  } catch(err) {
    console.log(err)
  }
}

// INIT 
const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerRender(controlSearchResults);
}

init();