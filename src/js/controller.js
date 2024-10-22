import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookMarkView from './views/bookMarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { async } from 'regenerator-runtime/runtime';

import {CLOSE_FORM_SEC} from './config.js'

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

    // 0) update the results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    bookMarkView.update(model.state.bookmarks);

  } catch (err) {
    recipeView.renderError();
  }
}

// SEARCH control
const controlSearchResults = async () => {
  try {
    // get term from Search VIEW
    const term = searchView.getTerm();
    if (!term) return;

    resultsView.renderSpinner();
    
    // pass the term => model => load search result (ALL results)
    await model.loadSearchResults(term);

    // render results PER PAGE (10 per page)
    resultsView.render(model.getSearchResultsPage())

    // render initial pagination 
    paginationView.render(model.state.search)    
    
  } catch(err) {
    console.log(err)
  }
}

const controlPagination = (gotoPage) => {
   // render results with go to page value
   resultsView.render(model.getSearchResultsPage(gotoPage))

   // render the next and prev pagination btn
   paginationView.render(model.state.search)    

}

// SERVINGS in Recipe view
const controlServings = (newServings) => {
    // Update recipe servings data
    model.updateServings(newServings)

    // RENDER New VIEW
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
}

// CONTROL ADD Bookmark
const controlAddBookmark = () =>  {
  // ADD or REMOVE bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id)

  // Update recipe view
  recipeView.update(model.state.recipe)

  // render the bookmark
  bookMarkView.render(model.state.bookmarks)
}

const controlBookmark = () => {
  bookMarkView.render(model.state.bookmarks)
}

const controlAddRecipe = async (newRecipe) => {
  try {
    //  show loading spinner
    addRecipeView.renderSpinner()

    // update the new recipe to server => DB
    await model.updateRecipe(newRecipe)

    console.log(model.state.recipe)

    // RENDER 
    recipeView.render(model.state.recipe)

    // display success message 
    addRecipeView.renderMessage()

    // render bookmark view 
    bookMarkView.render(model.state.bookmarks)

    // change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // close form window 
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, (CLOSE_FORM_SEC * 1000));

  } catch (err) {
    console.error(`🤔🤔${err}`)
    addRecipeView.renderError(err.message)
  }
}

// INIT 
const init = () => {
  bookMarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();