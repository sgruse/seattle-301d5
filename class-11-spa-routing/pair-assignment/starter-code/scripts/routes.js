// TODO: Configure routes for this app with page.js, by registering each URL your app can handle,
// linked to a a single controller function to handle it:

// TODO: What function do you call to activate page.js? Fire it off now, to execute
// calls all the methods we just set up inside articleController.js file when this route loaded.
page('/', articlesController.index);
page('/about', aboutController.index);
// Must call the page() to instantiate these routes.
page();

// Incase of errors when loading routes we might have to specify specific properties of the page() routes using this syntax.
// page({
//   hashbang: true,
// })


// 1) trace the execution path
// 2) understand the call backs in the route
// 3) LOOK AT the removal of DOM elements
