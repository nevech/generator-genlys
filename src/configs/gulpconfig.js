var args = require('yargs').argv;

module.exports = {
  // Angular app name
  'ngApp': 'genlys',

  // Destination directory
  'destDir': 'releases/tmp',

  // Current build directory
  'releaseDirname': 'current',

  // Number of releases to keep
  'keepReleases': 5,

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

  // Config for module fsdk. See: https://github.com/nevech/fsdk
  'fsdk': {
    'src': 'sdk/**/*.*',
    'dest': 'sdk',
    'env': 'app'
  },

  'paths': {
    'scripts': 'app/**/*.{js,coffee}',
    'coffee': 'app/**/*.coffee',
    'js': 'app/**/*.js',
    'templates': 'app/**/*.{jade,html}',
    'jade': 'app/**/*.jade',
    'html': 'app/**/*.html',
    'styles': 'app/**/*.{styl,css}',
    'stylus': 'app/**/*.styl',
    'css': 'app/**/*.css',
    'images': 'app/public/images/**/*.{jpg,png,jpeg}',
    'assets': [
      'app/public/**/*',
      '!app/public/images',
      '!app/public/fonts',
    ]
  },

};