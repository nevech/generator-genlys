var args = require('yargs').argv;

module.exports = {
  // Angular app name
  'ngApp': '<%= options.appName %>',

  // Destination directory
  'destDir': '.tmp',

  // Build directory
  'buildDir': 'dist',

  // HTTP port for browser-sync
  'port': process.env.PORT || 9000,

  // Environment:
  // 1) Get from command line arguments. Example: gulp task_name --env=production
  // 2) Get from environment variable (process.env.NODE_ENV)
  // 3) Or set default development
  'env': args.env || process.env.NODE_ENV || 'development',

  // Option for autoprefixer. See: https://github.com/postcss/autoprefixer-core#usage
  'autoprefixer': {
    'browsers': ['> 2%']
  },

  'paths': {
    'scripts': 'app/scripts/**/*.{js,coffee}',
    'coffee': 'app/scripts/**/*.coffee',
    'js': 'app/scripts/**/*.js',
    'templates': 'app/**/*.{jade,html}',
    'jade': 'app/**/*.jade',
    'html': 'app/**/*.html',
    'styles': 'app/styles/**/*.{styl,css}',
    'stylus': 'app/styles/**/*.styl',
    'css': 'app/styles/**/*.css',
    'images': 'app/public/images/**/*.{jpg,png,jpeg}',
    'assets': [
      'app/public/**/*',
      '!app/public/images',
      '!app/public/fonts',
    ]
  },

  // Configs for environments
  'development': {
    'compileCss': false
  },

  'production': {
    'isMinifyCss': true
  }

};