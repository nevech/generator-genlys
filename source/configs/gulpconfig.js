var args = require('yargs').argv;

module.exports = {
  // Angular app name
  'ngApp': 'genlys',

  // Destination directory
  'destDir': '.tmp',

  // Current build directory
  'releaseDirname': 'current',

  // Number of releases to keep
  'keepReleases': 2,

  // HTTP port for browser-sync
  'port': process.env.PORT || 9000,

  // Environment:
  // 1) Get from command line arguments. Example: gulp task_name --env=production
  // 2) Get from environment variable (process.env.NODE_ENV)
  // 3) Or set default local
  'env': args.env || process.env.NODE_ENV || 'local',

  // Option for autoprefixer. See: https://github.com/postcss/autoprefixer-core#usage
  'autoprefixer': {
    'browsers': ['> 2%']
  },

  // Configs for environments
  'environments': {

    'local': {
      'compressFiles': false
    },

    'development': {
      'compressFiles': false
    },

    'production': {
      'compressFiles': true
    }

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

};