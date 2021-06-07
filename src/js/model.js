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

  } catch (err) {
    console.error(`${err} 🙄`);
    throw err;
  }
};

export const loadSearchResults = async term => {
  try {
    state.search.term = term;

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