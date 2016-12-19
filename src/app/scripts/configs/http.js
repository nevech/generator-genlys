app.config(($httpProvider, $locationProvider) => {
  $locationProvider.html5Mode(true);

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.common["Accept"] = 'application/json';

  $httpProvider.interceptors.push(['$q', '$cookies', ($q, $cookies) => {
    return {
      request(config) {
        return config;
      },

      response(response) {
        return response;
      },

      responseError(response) {
        return $q.reject(response);
      }
    }
  }]);
});