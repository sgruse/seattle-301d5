(function(module) {
  var articlesController = {};

  // TODO: Create the `articles` table when the controller first loads, with the code that used to be in index.html:
  // Using the creat table method to make a table in our database.
  Article.createTable();

  // TODO: Setup a function that kicks off the fetching and rendering of articles, using the same
  // code that used to be in index.html.
  // Also be sure to hide all the main section elements, and reveal the #articles section:
  // .index now runs the fetchAll and initIndex page, hides all sections and shows only the articles sections.  Now we must set up a route for our articleController to run.
  // fetchAll accepts the initIndexPage as a paramater and then uses the (next) to fire off every function in the chain.
  articlesController.index = function() {
    Article.fetchAll(articleView.initIndexPage);

    $('main > section').hide();
    $('#articles').show();
  };

  module.articlesController = articlesController;
})(window);
