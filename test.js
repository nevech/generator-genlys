var result, str = 'some my app';

result = str.replace(/( [a-z])*/gi, function (str) {
  console.log(arguments);
  return str;
});

console.log(result);
console.log('====================================================================');