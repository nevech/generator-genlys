# Configuring application

After run `gulp serve` or `gulp build` file `app/configs/config.js` will be created. This file contains constants for your `angular.module`.
Constants are generated depending on your `NODE_ENV` (default: `development`). Constants gets from `configs/ng_config`.

Connecting configs from command console:

```
$ gulp serve --env=production
```

or

```
$ gulp build --env=production
```

Also you can add your own config file to `configs/ng_config` and use. For more info about configs see: [gulp-ng-config](https://www.npmjs.com/package/gulp-ng-config)