app.run(($rootScope, PageFactory, API_HOST) => {
  $rootScope.Page = PageFactory;

  // Set title page.
  // Get from route param title.
  $rootScope.$on('$routeChangeSuccess', (e, nextRoute) => {
    if (nextRoute.title) {
      PageFactory.setTitle(nextRoute.title);
    }
  });
});
