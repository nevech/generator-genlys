# <%= options.appName %>

## Dependencies

* node >= 0.10.0
* npm >= 2.8.3
* bower >= 1.4.1
* gulp >= 3.8.11

## Install global packages

```sh
npm install -g bower gulp-cli
```

## Build instruction

* Install npm packages `npm install`
* Install bower packages `bower install`
* Run `grunt serve` to run development server
* Run `grunt build` to build project (static version)

**Use configs**

Сonfiguration file in the folder `app/config.json`.

* Run `grunt serve --production` to run development server with config production.
* Run `grunt build --production` to build project with config production.

Default is `development` config.

[More info](https://github.com/nevech/generator-genlys/blob/master/docs/README.md)


## License
[MIT license](http://opensource.org/licenses/MIT)