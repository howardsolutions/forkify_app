import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

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

const createRecipeObject = data => {
  const { recipe } = data.data

  return  {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    publisher: recipe.publisher,
    ...(recipe.key && {key: recipe.key})
  };
} 

export const loadRecipe = async id => {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

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

    const data = await getJSON(`${API_URL}?search=${term}&key=${KEY}`);
    console.log(data)

    // update search state
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && {key: rec.key})
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

  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    // new quantity = newservings * oldquantity / old serving
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const addBookmark = recipe => {
  // add book mark
  state.bookmarks.push(recipe);

  // Mark current recipe is bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = id => {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe is NOT bookmark
  if (state.recipe.id === id) state.recipe.bookmarked = false;

  persistBookmarks();

  console.log(state);
};

export const updateRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].trim().split(',');
        const [quantity, unit, description] = ingArr;

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format 😅'
          );

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
    
  } catch (err) {
    throw err;
  }
};

const init = () => {
  const storage = localStorage.getItem('bookmark');

  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
