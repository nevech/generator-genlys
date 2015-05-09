# Getting Started

If you haven't already, install [yo](https://github.com/yeoman/yo), [bower](http://bower.io/) and this generator:

```sh
npm install -g yo bower generator-genlys
```

Now you can scaffold your own web app:

```sh
mkdir my-app
cd my-app
yo genlys
```

## Project structure
After generating your project will have the following structure:

```
app
├─── public
│  ├─── fonts
│  ├─── images
│  └─── robots.txt
├─── scripts
│  ├── configs
│  │  ├─── http.coffee
│  │  ├─── routes.coffee
│  │  └─── run.coffee
│  ├─── controllers
│  │  ├─── global.coffee
│  │  └─── home.coffee
│  ├─── directives
│  ├─── factories
│  │  └─── page.coffee
│  ├─── services
│  ├─── app.coffee
├─── styles
│  ├─── main.styl
├─── views
│  ├─── home.jade
├─── config.json
└─── index.jade
```


## General tasks
To start developing run:

```sh
gulp serve
```

This will fire up a local web server, open `http://localhost:9000` in your default browser and watch files for changes reloading the browser automatically via [BrowserSync](http://www.browsersync.io/)


To make a production-ready build of the app run:

```sh
gulp build
```

If you want to check your build run:

```sh
gulp serve:dist
```

**Public dir**
All files in `app/public` directory are copied to the root of the build (`dist`).

## Configs
After run `gulp serve` or `gulp build` file `app/configs/config.js` will be created. This file contains constants for your `angular.module`.
Constants are generated depending on your NODE_ENV (default: `development`). Constants gets from file `app/config.json`.

Connecting configs from console:

```
gulp serve --production
```

or

```
gulp build --production
```

You can also add your own ENV to `app/config.json` and use. For more info about configs see: [gulp-ng-config](https://www.npmjs.com/package/gulp-ng-config)