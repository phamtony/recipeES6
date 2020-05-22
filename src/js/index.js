import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likeView from './view/likeView';
import { elements, renderLoader, clearLoader } from './view/base';

/** Global State of the app
- Search Object
- Current Recipe Object
- Shopping list object
- Liked object
**/
const state = {};
window.state = state;

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
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		if (state.search) searchView.highlightSelected(id);

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
			clearLoader();
			recipeView.renderRecipe(
				state.recipe,
				state.likes.isLiked(id)
			);
		} catch(err) {
			console.log('Error processing recipe!');
		}
	}
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List Controller
const controlList = () => {
	// Create a new list if there is none
	if (!state.list) state.list = new List();

	// add each ingredient to the list
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};


// Like Controller

//Temp testing DELETE LATER
state.likes = new Likes();
likeView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	const currentID = state.recipe.id;

	//user has not liked current recipe
	if (!state.likes.isLiked(currentID)) {
		// Add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		)
		//Toggle the like button
		likeView.toggleLikeBtn(true);

		//add like to the UI List
		likeView.renderLike(newLike);

		// User has liked it
	} else {
		// Remove like to the state
		state.likes.deleteLike(currentID);

		//Toggle the like button
		likeView.toggleLikeBtn(false);

		//Remove like to the UI List
		likeView.deleteLike(currentID);
	}

	likeView.toggleLikeMenu(state.likes.getNumLikes());
};


//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	if (e.target.matches('.shopping__delete,.shopping__delete *')) {
		//delete from state
		state.list.deleteItem(id);

		//delete from UI
		listView.deleteItem(id);

		//handle count event
	} else if (e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value, 10);
		state.list.updateItem(id, val);
	}
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		//increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		// add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		//like controller
		controlLike();
	}
});

