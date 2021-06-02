import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    term: '',
    results: [],
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

