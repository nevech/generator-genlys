# <%= options.appName %>

## Dependencies

* node >= 4.2.3
* npm = 2.14.7
* bower >= 1.7.1
* gulp >= 3.9.0

## Install global packages

```sh
$ npm install -g bower gulp
```

## Build instruction

* Install npm packages `npm install`
* Install bower packages `bower install`
* Run `gulp dev` to run development server
* Run `gulp build` to build project (static version)

**Use configs**

Сonfiguration files in the folder `configs`.

* Run `gulp dev --env=production` to run development server with config production.
* Run `gulp build --env=production` to build project with config production.

Default is `local` config.

[More info](https://github.com/nevech/generator-genlys/blob/master/docs/README.md)