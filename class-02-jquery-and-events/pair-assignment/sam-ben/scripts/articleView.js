// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      // DONE: We need to take every author name from the page, and make it an option in the Author filter.
      //       To do so, Build an `option` DOM element that we can append to the author select box.
      //       Start by grabbing the author's name from `this` article element, and then use that bit of
      //       text to create the option tag (in a variable named `optionTag`),
      //       that we can append to the #author-filter select element.
      //       YAY, DOM manipulation!
      var val = $(this).find('address a').text();
      var optionTag = '<option value="' + val + '">' + val + '</option>';
      $('#author-filter').append(optionTag);
      // DONE: Similar to the above, but...
      //       Avoid duplicates! We don't want to append the category name if the select
      //       already has this category as an option!
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
      $('article').each(function() {
        if ($(this).find('address > a').text() === $('#author-filter').val()){
          $(this).show();
        }
      });
    } else {
      $('article').show();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('#author-filter').val(''); // reset author filter on select category
      $('article').hide();
      $('article').each(function() {
        if ($(this).data('category') === $('#category-filter').val()) {
          $(this).show();
        }
      });
    } else {
      $('article').show();
    }
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', 'li', function() {
    var $main_section = $('main > section');
    var $nav_click = $(this).data('content');
    $main_section.hide();
    $main_section.each(function() {
      if($(this).attr('id') === $nav_click) {
        $(this).show();
      }
    });
  });

  $('.main-nav .tab:first').click(); // Let's now trigger a click on the first .tab element, to set up the page.
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide(); // Hide elements beyond the first 2 in any artcile body.

  $('#articles').on('click', '.read-on', function(event) {
    event.preventDefault();
    $(this).parent().find('*').show();
    $(this).hide();
  });

};

$(document).ready(function() {
  articleView.populateFilters();
  articleView.handleMainNav();
  articleView.handleAuthorFilter();
  articleView.handleCategoryFilter();
  articleView.setTeasers();
});
