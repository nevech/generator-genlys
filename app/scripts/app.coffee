app = angular.module('myApp', [
  'ngCookies'
  'ngResource'
  'ngRoute'
  'ngAnimate'
])

app.run ($rootScope, PageFactory) ->
  $rootScope.Page = PageFactory

  # Set title page.
  # Get from route param title.
  $rootScope.$on '$routeChangeSuccess', (e, nextRoute) ->
    if nextRoute.title
      PageFactory.setTitle(nextRoute.title)
