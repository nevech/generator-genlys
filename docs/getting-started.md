# Getting Started

If you haven't already, install [yo](https://github.com/yeoman/yo), [bower](http://bower.io/) and genlys :)

```sh
$ npm install -g yo bower generator-genlys
```

Now you can scaffold your own web app:

```sh
$ mkdir my-app
$ cd my-app
$ yo genlys
```

After generating your project will have the following structure:

```
app/
├─── public/
│  ├─── fonts/
│  └─── images/
├─── scripts/
│  ├── configs/
│  │  ├─── http.js
│  │  ├─── routes.js
│  │  └─── run.js
│  ├─── controllers/
│  │  ├─── root.js
│  │  └─── home.js
│  ├─── directives/
│  ├─── factories/
│  │  └─── page.js
│  ├─── services/
│  ├─── app.js
├─── styles/
│  └─── main.styl
├─── views/
│  └─── home.pug
├─── configs/
│  └─── home.pug
└─── index.pug
```

All files in `app/public` directory are copied to the root of the build.
