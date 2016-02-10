// TODO: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
// at the end of this we can use module to reference everything on the inside.
//  var stuff = 'stuff';
//  module.stuff = stuff;
// When i export this to the window, I am attaching this object to the window so that we can reference it, >>>Expose Article to the window so we can access Article and its properties from the window. Window.Article = Article which means we can access everything in Article from the window.  Do this all at the end.
(function(module) {

  module.Article = Article;

  put shit in here.
}(window));

function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  // DONE: Refactor this forEach code, by using a `.map` call instead, since want we are trying to accomplish
  // is the transformation of one colleciton into another.
  // rawData.forEach(function(ele) {
  //   Article.all.push(new Article(ele));
  // })
  Article.all = rawData.map(function(ele) {
    return new Article(ele);
  });
};

// are article.all array will now contain all of the objects with the function

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
// TODO: Refactor this function, so it accepts an argument of a callback function (likely a view function)
// to execute once the loading of articles is done.
Article.fetchAll = function() {
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
    articleView.initIndexPage();
  } else {
    $.getJSON('/data/hackerIpsum.json', function(rawData) {
      Article.loadAll(rawData);
      localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
      articleView.initIndexPage();
    });
  }
};

// TODO: Chain together a `map` and a `reduce` call to get a rough count of all words in all articles.
// we are taking an array of objects, mapping to each item in that array, (accepting article as parameter which is each article in the array) targeting the body of each object and counting the amount word in each body.
Article.numWordsAll = function() {
  return Article.all.map(function(article) {
    return article.body.match(/\b\w+/g).length;
    // return // Get the total number of words in this article
  })
  // a, b represent previous and current to squash together and calculate the total sum of the arry.
  // we use returns so we don't have to declare variables to hold the information.
  .reduce(function(a, b) {
    return a + b;
    // Sum up all the values in the collection
  })
};

// TODO: Chain together a `map` and a `reduce` call to produce an array of unique author names.
Article.allAuthors = function() {
  return // Don't forget to read the docs on map and reduce!
};

Article.numWordsByAuthor = function() {
  // TODO: Transform each author string into an object with 2 properties: One for
  // the author's name, and one for the total number of words across all articles written by the specified author.
  return Article.allAuthors().map(function(author) {
    return {
      // someKey: someValOrFunctionCall().map(...).reduce(...), ...
    }
  })
};
