app.factory('PageFactory', function() {
  let title = 'myApp';

  this.getTitle = () => title;

  this.setTitle = _title => title = _title;

  return this;
});