app.run ($rootScope, PageFactory, apiHost) ->
  $rootScope.Page = PageFactory

  console.log 'Connected to api host: ' + apiHost

  # Set title page.
  # Get from route param title.
  $rootScope.$on '$routeChangeSuccess', (e, nextRoute) ->
    if nextRoute.title
      PageFactory.setTitle(nextRoute.title)
