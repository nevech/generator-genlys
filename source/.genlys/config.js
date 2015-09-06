var config = require('../configs/gulpconfig.js');
var configENV = config.environments[config.env];

function getConfigENV (name, defaultValue) {
  var defaultValue = defaultValue || true;

  if (!configENV || configENV[name] == undefined) {
    return defaultValue;
  }

  return configENV[name];
}

config.isCompressCSS = function () {
  return getConfigENV('compileFiles');
};

config.getPathToNgConfig = function () {
  return 'configs/constants/angular/' + config.env + '.json';
};

config.optionLoadPlugins = {
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
};

module.exports = config;