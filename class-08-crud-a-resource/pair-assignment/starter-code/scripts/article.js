(function(module) {
  function Article (opts) {
    // DONE: Convert property assignment to Functional Programming style. Now, ALL properties of `opts` will be
    // assigned as properies of the newly created article object.
    // using (opts) allows us to create more properies and pull them into our constructor.
    // Before we had a set of properies to pick up on and now they will be dynamically generated.
    // Object.keys extracts all the keys that are attached to the Object.  All of the properties.
    Object.keys(opts).forEach(function(e, index, keys) {
      this[e] = opts[e];
    },this);
  }

  Article.all = [];

  Article.prototype.toHtml = function() {

    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  // DONE: Set up a DB table for articles.
  // create a sequel query string on the '...'. first way is a string with a callback, so create string.  Figure out where the callback() function is coming from.
  Article.createTable = function(callback) {
    webDB.execute(                                                     //SEQUEL STATEMENT (don't forget ; at end of statement)//
      'CREATE TABLE IF NOT EXISTS articles ( ' +
      'id INTEGER PRIMARY KEY, ' +
      'title VARCHAR(255) NOT NULL, ' +
      'category VARCHAR(50) NOT NULL, ' +
      'author VARCHAR(50) NOT NULL, ' +
      'authorUrl VARCHAR(100) NOT NULL, ' +
      'publishedOn VARCHAR(25) NOT NULL, ' +
      'body VARCHAR(1000) ' +
      '); ',
      function(result) {                                                //CALLBACK//
        console.log('Successfully set up the articles table.', result);
        if (callback) callback();
      }
    );
  };

  // DONE: Correct the SQL to delete all records from the articles table.
  Article.truncateTable = function(callback) {
    webDB.execute(
      'DELETE FROM articles;',
      callback
    );
  };


  // DONE: Insert an article instance into the database
  // We are updating values in the query based on data in our files
  // Appending a new record to our database table where we input data into our placeholders.
  // Seperating out our sequel query from our data.  The ? route in order to data. Now our data exists in an object.
  // *** This is the pattern we want to follow.
  Article.prototype.insertRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, body) VALUES (?, ?, ?, ?, ?, ?);',
          'data': [this.title, this.author, this.authorUrl, this.category, this.publishedOn, this.body],
        }
      ],
      callback
    );
  };

  // : Delete an article instance from the database:
  // Similar to insert, we must create a query for delete and update record similar to insert.
  Article.prototype.deleteRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'DELETE FROM articles VALUES (?);',
          'data': [this.title],
        }
      ],
      function(result) {                                                //CALLBACK//
        console.log('Successfully set up the articles table.', result);
        if (callback) callback();
      }
    );
  };

  // : Update an article instance, overwriting it's properties into the corresponding record in the database:
  Article.prototype.updateRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'UPDATE article (title, author, authorUrl, category, publishedOn, body) VALUES (?, ?, ?, ?, ?, ?);',
          'data': [this.title, this.author, this.authorUrl, this.category, this.publishedOn, this.body],
        }
      ],
      function(result) {                                                //CALLBACK//
        console.log('Successfully set up the articles table.', result);
        if (callback) callback();
      }
    );
  };

  // DONE: Refactor to expect the raw data from the database, rather than localStorage.
  Article.loadAll = function(rows) {
    Article.all = rows.map(function(ele) {
      return new Article(ele);
    });
  };

  // : Refactor this to check if the database holds any records or not. If the DB is empty,
  // we need to retrieve the JSON and process it.
  // If the DB has data already, we'll load up the data (sorted!), and then hand off control to the View.
  // We are going to go have remember the idea of asynchronus programming, use the resources above.  The .init method creates the connection to the database, the .DB method creates the query (in three different ways).
  Article.fetchAll = function(next) {

    webDB.execute('SELECT * FROM articles', function(rows) {

      if (rows.length) {
        Article.loadAll(rows);
        next();

      } else {
        console.log('cat');
        $.getJSON('/data/hackerIpsum.json', function(rawData) {
          // Cache the json, so we don't need to request it next time:
          rawData.forEach(function(item) {
            var article = new Article(item); // Instantiate an article based on item from JSON
            // Cache the newly-instantiated article in DB:
            console.log(article);
            article.insertRecord();


          });
          // Now get ALL the records out the DB, with their database IDs:
          webDB.execute('SELECT id FROM articles', function(rows) {
            // Now instanitate those rows with the .loadAll function, and pass control to the view.
            Article.loadAll(rows);
            next();


          });
        });
      }
    });
  };

  Article.allAuthors = function() {
    return Article.all.map(function(article) {
      return article.author;
    })
    .reduce(function(names, name) {
      if (names.indexOf(name) === -1) {
        names.push(name);
      }
      return names;
    }, []);
  };

  Article.numWordsAll = function() {
    return Article.all.map(function(article) {
      return article.body.match(/\b\w+/g).length;
    })
    .reduce(function(a, b) {
      return a + b;
    });
  };

  Article.numWordsByAuthor = function() {
    return Article.allAuthors().map(function(author) {
      return {
        name: author,
        numWords: Article.all.filter(function(a) {
          return a.author === author;
        })
        .map(function(a) {
          return a.body.match(/\b\w+/g).length
        })
        .reduce(function(a, b) {
          return a + b;
        })
      }
    })
  };

  Article.stats = function() {
    return {
      numArticles: Article.all.length,
      numWords: Article.numwords(),
      Authors: Article.allAuthors(),
    };
  }

  module.Article = Article;
})(window);
