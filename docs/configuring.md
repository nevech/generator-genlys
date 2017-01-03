# Configuring application

Configs are based on environments and placed inside `configs` directory.

## Angular constants

After run `gulp dev` or `gulp build` file `app/scripts/configs/config.js` will be created.
This file contains constants for your `angular.module`.
Constants are generated depending on your `NODE_ENV` (default: `local`).
Constants gets from `configs/constants`.

Connecting configs from command console:

```
$ gulp dev --env=staging
```

or

```
$ gulp build --env=production
```

Also you can add your own config file to `configs/constants` and use. For more info about configs see: [gulp-ng-config](https://www.npmjs.com/package/gulp-ng-config)
