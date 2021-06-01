import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
    recipe: {},
}

export const loadRecipe = async id => {
    try {
        const data = await getJSON(`${API_URL}/${id}`)
    
        console.log('data', data)
    
        const {recipe} = data.data;
    
        state.recipe = {
          cookingTime: recipe.cooking_time,
          id: recipe.id,
          title: recipe.title,
          ingredients: recipe.ingredients,
          servings: recipe.servings,
          image: recipe.image_url,
          sourceUrl: recipe.source_url,
          publisher: recipe.publisher
        }
    
        console.log(state.recipe, 'recipe state')
    } catch (err) {
        console.error(`😫😪😪 ${err}`)
    }
}