import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    term: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async id => {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;

    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      servings: recipe.servings,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      publisher: recipe.publisher,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;

  } catch (err) {
    console.error(`${err} 🙄`);
    throw err;
  }
};

export const loadSearchResults = async term => {
  try {
    state.search.term = term;
    state.search.page = 1;

    const data = await getJSON(`${API_URL}?search=${term}`);

    // update search state
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
      };
    });

  } catch (err) {
    console.error(`${err} 🙄`);
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  
  return state.search.results.slice(start, end)
}

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    // new quantity = newservings * oldquantity / old serving
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
  })

  state.recipe.servings = newServings;
}

const persistBookmarks = () => {
    localStorage.setItem('bookmark', JSON.stringify(state.bookmarks))
}

export const addBookmark = (recipe) => {
  // add book mark
  state.bookmarks.push(recipe)

  // Mark current recipe is bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks()
}

export const deleteBookmark = id => {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1)

  // mark current recipe is NOT bookmark
  if(state.recipe.id === id) state.recipe.bookmarked = false;

  persistBookmarks()

  console.log(state)
}

const init = () => {
  const storage =  localStorage.getItem('bookmark');

  if (storage) state.bookmarks = JSON.parse(storage)
}

init()