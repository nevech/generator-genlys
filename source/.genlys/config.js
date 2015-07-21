var config = require('../configs/gulpconfig.js');
var configENV = config[config.env];

function getConfigENV (name, defaultValue) {
  var defaultValue = defaultValue || true;

  if (!configENV || configENV[name] == undefined) {
    return defaultValue;
  }

  return configENV[name];
}

config.isCompileCSS = function () {
  return getConfigENV('compileCss');
};

config.isCompileJS = function () {
  return getConfigENV('compileJs');
};

config.getPathToNgConfig = function () {
  return 'configs/ng_config/' + config.env + '.json';
};

config.optionLoadPlugins = {
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
};

module.exports = config;