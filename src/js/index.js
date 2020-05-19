import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './view/searchView';
import { elements, renderLoader, clearLoader } from './view/base';

/** Global State of the app
- Search Object
- Current Recipe Object
- Shopping list object
- Liked object
**/
const state = {};

// Search Controller
const controlSearch = async () => {
		// 1. get query from view
		const query = searchView.getInput();

		if (query) {
			// 2 New search obj and add to state
			state.search = new Search(query);

			// 3 Prepare UI for the results
			searchView.clearInput();
			searchView.clearResults();
			renderLoader(elements.searchRes);

			try {
				// 4 Search for recipes
				await state.search.getResults()

				//5 Render results on UI
				clearLoader();
				searchView.renderResults(state.search.result);
			} catch(err) {
				console.log('Something went wrong here.');
				clearLoader();
			}
		}
};

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

// Recipe Controller
const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');

	if (id) {
		//Prepare UI for changes

		//Create new recipe object
		state.recipe = new Recipe(id);

		try {
			//Get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			//calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			//Render recipe
			console.log(state.recipe);
		} catch(err) {
			console.log('Error processing recipe!');
		}
	}
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
