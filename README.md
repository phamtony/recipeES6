# recipeES6
ES6 practic project
Recipe App

git clone
npm install
npm run start

Summary of Project

-Set up project
	-Required packages (plugins) (Node, NPM, Webpack, Babel, CoreJS, Axios)
	-File Structure
	-Config package files
	-Config file structure (seperation of views, controller, model; development and production)

-Project Architect with MVC
	-What the app does
	-What functions are there
	-Break down of each part of the app, to things needed to be built MVC


//Search.js (search model); index.js(controller); searchView.js(view)
-First API calls (getting data)
-Set-up state object in the controler

-Building Model (search model for getting recipes) (Search.js)
-Testing Model to controller, seeing if it's displaying data

-Building the View (search)
-Setting up base.js, creating a object for all dom selectors and exporting it out to other modules, also has elementStrings
-searchView.js, base.js, and index.js communicating together
	** limit recipe titles to 17 Char with split().reduce()
	** ajax loader (it's put in the base.js, so it can be reused throughout the site. also includes an arugment, parent)
-Building pagination
	-Start, end criteria. Button rendering, slice up results in conjunction to pages/results per page

-Building Model (Recipes)	
-Creating a config.js file (to have global keys that needs to be used sitewide)

-Build Controller (Recipe)
	-implementing hashchange eventlistener
	-implementing try catch on controller in case it doesn't work

-Re-visiting building model - Recipes

-Build View (Recipes)
	-format numbers for consistency
-Recipe servings update
