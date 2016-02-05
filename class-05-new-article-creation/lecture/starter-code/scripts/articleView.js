// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = '<option value="' + val + '">' + val + '</option>';
      $('#author-filter').append(optionTag);

      val = $(this).attr('data-category');
      optionTag = '<option value="' + val + '">' + val + '</option>';
      if ($('#category-filter option[value="' + val + '"]').length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-author="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-category="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function(e) {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });

  $('.main-nav .tab:first').click(); // Let's now trigger a click on the first .tab element, to set up the page.
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide(); // Hide elements beyond the first 2 in any artcile body.

  $('#articles').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    $(this).parent().find('*').fadeIn();
    $(this).hide();
  });
};

articleView.initNewArticlePage = function() {
  // TODO: Ensure the main .tab-content area is revealed. We might add more tabs later.

  $('.tab-content').show();

  // TODO: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  $('#export-field').hide();
  $('#article-json').on('focus', function(){
    $(this).select();
  });

  // TODO: Add an event handler to update the preview and the export field if any inputs change.

  // when #new-form changes, in the input > textarea run the function articleView
  // higher order functions: when you pass in function inside a funciton
  $('#new-form').on('change', 'input, textarea', articleView.create);


};

articleView.create = function() {
  // TODO: Set up a var to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  // .empty removes all contents of a parent.  .remove removes the parent
  var article;
  $('#articles').empty();

  // TODO: Instantiate an article based on what's in the form fields:
  // if the form field has a value, .val() would return that value, without a value in the form field, text inputed by user will atutomatically be put in .val()
  article = new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    // The below line: the :checked is checking if the status of this text box is checked.
    publishedOn: $('#article-published:checked').length ? util.today() : null
  });

  // TODO: Use our interface to the Handblebars template to put this new article into the DOM:
  // Below code is calling the .toHtml() file off of the portotype on article.js using the value we made above called article
  // It can now access the constructor
  $('#articles').append(article.toHtml());

  // TODO: Activate the highlighting of any code blocks:
  // pre code is added when the form is submitted, then is highlighed
  // anytime you do a .each() loop you should add in an idx, block so that we can reference the chain. "block" represents the block of code we are passing in.
  $('pre code').each(function(idx, block){
    hljs.highlight(Block);
  });

  // TODO: Export the new article as JSON, so it's ready to copy/paste into blogArticles.js
  // Creates a object that is stringified that we can call on later?
  // Now we can grab this data and put it into our rawData[{}] on blogarticle.js
  $('#export-field').show();
  $('#article-json').val(JSON.stringify(article) + ',');
};

// lets initialize our article page by showing all the content, then when we focus on box and change our input field, run our article view .create function and make a new article that takes the values from our input field and then find our article section and append our new article to the DOM using the Article.prototype.toHtml() which will take this info and append everything to the DOM. And then we are going through everytihng on this page that is defined with a pre-code tag, and highlight with our highligh JS third pulgin party.  >>inside vendor, scripts, highligh.pack.js.

// To keep practicing getting thins from input field and stringifying this data: go to codepen and make some form fields and then write out the JS to extract and stringify this Data.

// To debug this kind of stuff, maybe we can't get the value of our input fields.  Console.log('Value of selected input: ' + $(this).val() );
//If this didn't work keep moving down the chain ^ until you find where it doesn't work or breaks.

articleView.initIndexPage = function() {
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
