import * as model from './model.js' 
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

// if(module.hot){
//   module.hot.accept();
// }


const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)

const controlRecipes = async function () {
  try{
    const id = window.location.hash.slice(1)

    if(!id) return;
    recipeView.renderSpinner()

    //Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage())

    //Loading Recipe
    await model.loadRecipe(id)

    // Rendering Recipe
    recipeView.render(model.state.recipe)

  } catch(err) {
    recipeView.renderError()
  }
  
}

const controlSearchResults = async function (){
  try{
    resultsView.renderSpinner();
    // get search query
    const query = searchView.getQuery()
    if(!query) return ;

    //load search results
    await model.loadSearchResults(query)

    //Render results
    resultsView.render(model.getSearchResultsPage())

    //Render initial Pagination buttons
    paginationView.render(model.state.search)

  }catch(err){
    console.log(err)
  }
}

const controlPagination = function (goToPage){
    //Render new results
    resultsView.render(model.getSearchResultsPage(goToPage))

    //Render new Pagination buttons
    paginationView.render(model.state.search)
}


const controlServings = function(newServings){ 
  //Update the recipe servings
  model.updateServings(newServings)
  
  //Update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const init = function (){
 recipeView.addHandlerRender(controlRecipes)
 recipeView.addHandlerUpdateServings( controlServings)
 searchView.addHandlerSearch(controlSearchResults)
 paginationView.addHandlerClick(controlPagination);

}
init();