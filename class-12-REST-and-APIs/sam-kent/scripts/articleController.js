(function(module) {
  var articlesController = {};

  Article.createTable();

  articlesController.index = function(ctx, next) {
    Article.fetchAll(articleView.initIndexPage);

    $('#articles').show();

    ctx.handled = true;
    next();
  };

  articlesController.exit = function(ctx, next) {
    $('#articles').hide();

    next();
  };

  module.articlesController = articlesController;
})(window);
