app.config ($routeProvider) ->
  $routeProvider
    .when '/',
      templateUrl: 'views/home.html'
      controller: 'HomeCtrl'
      title: 'Welcome'
    .otherwise
      redirectTo: '/'