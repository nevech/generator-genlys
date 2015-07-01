app.config ($httpProvider, $locationProvider) ->
  $locationProvider.html5Mode(true)

  $httpProvider.defaults.useXDomain = true
  $httpProvider.defaults.headers.common['Access-Control-Allow-Origin']

  $httpProvider.interceptors.push ['$q', '$cookies', ($q, $cookies) ->
    {
      request: (config) ->
        # token = $cookies.token

        # if token
        #   config.params = {} unless config.params
        #   config.params.token = token

        return config
    }
  ]