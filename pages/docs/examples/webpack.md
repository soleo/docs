import asset from 'next/asset'
import withDoc from '../../../lib/with-doc'

import { sergio } from '../../../lib/data/team'
import Now from '../../../components/now/now'
import { InternalLink, AnchorLink } from '../../../components/text/link'
import Image from '../../../components/image'
import { TerminalInput } from '../../../components/text/terminal'

export const meta = {
  title: 'Building an Application Bundled with webpack',
  description: 'Building and deploying a basic application using webpack bundler with Now',
  date: '18 Jun 2018',
  authors: [sergio],
  editUrl: 'pages/docs/examples/webpack.md'
}

[webpack](http://webpack.js.org/) is an extensible zero config bundler for web application. It has a basic configuration which works for simple apps and can be configured to support many other special cases.

In this page we will see how to create a simple web application using webpack as module bundler and deploy it to Now. If you want to learn more about webpack read their [documentation](https://webpack.js.org/concepts/).

## Setup

Let's start with creating a new empty directory and moving into it:

<TerminalInput>mkdir webpack-app && cd webpack-app</TerminalInput>

Next, create the project's `package.json` in that directory:

```json
{
  "name": "webpack-app",
  "scripts": {
    "dev": "webpack --mode=development --watch",
    "build": "webpack --mode=production",
    "start": "serve --single"
  }
}
```

The JSON code shown above tells [npm](https://www.npmjs.com/) to prepare three commands:

* `npm run dev` – Runs `webpack` in the development mode and keep watching our JS files for changes to build our application again.
* `npm run build` – This command will be run by <Now color="000" /> on the server (you can also enter it in your terminal to try out how the application will look in production) and prepare it to be served to the visitor.
* `npm start` – Once `webpack` has built the app with `npm run build` or while is watching it on development with `npm run dev`, this command will serve the code to the end user. As long as it runs, your app will be accessible!

Got it? Pretty straight-forward, isn't it?

Now that we've told `webpack` what to do, we still need to install it. In order to run our HTTP server we also need to install [serve](https://github.com/zeit/serve) and to run webpack as a CLI command we need `webpack-cli`.

<TerminalInput>
  npm install webpack webpack-cli serve --save
</TerminalInput>

The command shown above installs all three dependencies and adds them to your `package.json` file, so that you can install them again by just running `npm install` later.

## Adding Content

Now that the project's meta files are in place, we can start adding the code that will be rendered when a visitor accesses the site. We will create an `./index.html`, `./src/main.js` and `./src/update.js`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Parcel App</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <script src="./main.js"></script>
</body>
</html>
```

Our `index.html` will load the `./main.js` files using a normal `<script>` tags.

```js
import update from "./update.js";

update("Hello, Now");
```

```js
export default (str) => document.querySelector("h1").innerText = str;
```

Our `main.js` will import `update.js` and call the exported function, note webpack doesn't run Babel by default, but it still has support for ES Modules.

## Trying out the Code

Now let's see everything is working. The `dev` script will run `webpack` in development mode where it will bundle the files without minifying them and wait for file change to build again. This can be run with the following command:

<TerminalInput>npm run dev</TerminalInput>

After this it will show you on your terminal the following output:

```bash
▲ webpack-app npm run dev

> webpack-app@ dev /Users/zeit/webpack-app
> webpack --mode=development --watch


webpack is watching the files…

Hash: 80021bc19ad48f780316
Version: webpack 4.12.0
Time: 103ms
Built at: 2018-06-18 23:53:54
  Asset      Size  Chunks             Chunk Names
main.js  4.51 KiB    main  [emitted]  main
[./src/index.js] 58 bytes {main} [built]
[./src/update.js] 68 bytes {main} [built]
```

Now in another terminal (or terminal tab) run the following command:

<TerminalInput>npm start</TerminalInput>

And you will see the following output:

```bash
▲ webpack-app at master ✖ npm start
> webpack-app@ start /Users/sergio/webpack-app
> serve --single


   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   Serving!                                       │
   │                                                  │
   │   - Local:            http://localhost:5000      │
   │   - On Your Network:  http://192.168.1.1:5000    │
   │                                                  │
   │   Copied local address to clipboard!             │
   │                                                  │
   └──────────────────────────────────────────────────┘
```

You can now go to <http://localhost:5000> in your browser.

That's all! Now the application is **ready to be deployed**

## Deploying the App

Once the application works as expected, you can **deploy it** by running this command:

<TerminalInput>now</TerminalInput>

Once <Now color="#000" /> has finished uploading the files, you'll see a URL that points to your freshly created application. This means that you can already share the URL with other people across the globe and have them enjoy it.

But in the case of a real service (not used for testing purposes), you would now have to assign an <InternalLink href="/docs/features/aliases">alias</InternalLink> to it.

## Optional: Using Env & Secrets

Now comes with an easy to use [environment variables and secrets](/docs/features/env-and-secrets) support which lets you save secrets with a single command and then use them while deploying.

webpack has a plugin that let's you explicitelly define what environment variables you want to inline in your JavaScript code. So we can setup a secret like:

<TerminalInput>now secret bundler webpack</TerminalInput>

And create a basic configuration file on `webpack.config.js`.

```js
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  plugins: [
    new webpack.EnvironmentPlugin(['BUNDLER'])
  ]
};
```

And then change our deploy script to the command:

<TerminalInput>now -e BUNDLER=@bundler</TerminalInput>

Now we can made use of it inside our application code.

```js
import update from "./update.js";

update(`Hello, ${process.env.BUNDLER}`);
```

This will output `Hello, webpack` inside our `<h1>`.

## Optional: Static Deployment

So far the deployment has been create a [Node.js deployment](/docs/deployment-types/node) and running `serve` as an HTTP server inside it. Doing this let us build our web application directly inside Now and made use of Now environment variables and secrets.

If you don't want to build inside Now (eg. [your are building inside your CI pipeline](/docs/continuous-integration/travis#optional:-avoid-building-on-now-(instead-build-on-travis))) and you don't want to use env and secrets you can let webpack build your application locally and use Now only for a static deployment.

To do so we need to add a `now.json` file to setup how Now will treat our deployments.

```json
{
  "type": "static",
  "files": [
    "./dist",
    "./index.html"
  ],
  "static": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

The JSON file above configure our deployment to be `static`, only upload the `./dist` folder created by running `npm run build` and the `./index.html` and reply with the `index.html` for every request to a non-matching file (this let us support Single Page Applications).

Now let's deploy our application running the following command:

```shell
rm -r ./dist && npm run build && now
```

The command will remove the current `./dist` folder (to avoid uploading development and old files), build our application with `webpack` and upload and deploy the new the version of the web application.

export default withDoc({...meta})(({children}) => <>{children}</>)
