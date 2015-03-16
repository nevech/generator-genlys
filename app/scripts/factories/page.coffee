app.factory 'PageFactory', ->
  title = 'myApp'

  @getTitle = -> title

  @setTitle = (_t) -> title = _t

  return this