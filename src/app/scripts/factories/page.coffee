app.factory 'PageFactory', ->
  title = 'myApp'

  @getTitle = -> title

  @setTitle = (_title) -> title = _title

  return this