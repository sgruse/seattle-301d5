(function(module) {
  var aboutController = {};

  aboutController.index = function(ctx, next) {
    // DONE: Call a function to load all the data.
    // Pass a view function as a callback, so the view will render after the data is loaded.
    repos.requestRepos(repoView.index);

    $('#about').show();

    ctx.handled = true;
    next();
  };

  aboutController.exit = function(ctx, next) {
    $('#about').hide();

    next();
  };

  module.aboutController = aboutController;
})(window);
