import asset from 'next/asset'
import withDoc from '../../../lib/with-doc'

import { sergio } from '../../../lib/data/team'
import Now from '../../../components/now/now'
import { InternalLink, AnchorLink } from '../../../components/text/link'
import Image from '../../../components/image'
import { TerminalInput } from '../../../components/text/terminal'

export const meta = {
  title: 'Building an Application Bundled with Parcel',
  description: 'Building and deploying a basic application using Parcel bundler with Now',
  date: '18 Jun 2018',
  authors: [sergio],
  editUrl: 'pages/docs/examples/parcel.md'
}

[Parcel](https://parceljs.org/) is zero config bundler for web application. It infer what tools your application needs based on the files you are importing (eg. uses Babel for `.js` and TypeScript for `.ts`).

In this page we will see how to create a simple web application using Parcel as module bundler and deploy it to Now. If you want to learn more about Parcel read their [documentation](https://parceljs.org/getting_started.html).

## Setup

Let's start with creating a new empty directory and moving into it:

<TerminalInput>mkdir parcel-app && cd parcel-app</TerminalInput>

Next, create the project's `package.json` in that directory:

```
{
  "name": "parcel-app",
  "scripts": {
    "dev": "parcel index.html",
    "build": "parcel build index.html",
    "start": "serve ./dist --single"
  }
}
```

The JSON code shown above tells [npm](https://www.npmjs.com/) to prepare three commands:

* `npm run dev` – Runs `parcel` in the development mode and creates a server for testing the application locally. Parcel uses the file in the key `main` as entry point.
* `npm run build` – This command will be run by <Now color="000" /> on the server (you can also enter it in your terminal to try out how the application will look in production) and prepare it to be served to the visitor.
* `npm start` – Once `parcel` has built the app with `npm run build`, this command will serve the code to the end user. As long as it runs, your app will be accessible!

Got it? Pretty straight-forward, isn't it?

Now that we've told `parcel` what to do, we still need to install it. In order to run our HTTP server we also need to install [serve](https://github.com/zeit/serve)

<TerminalInput>
  npm install parcel serve --save
</TerminalInput>

The command shown above installs all two dependencies and adds them to your `package.json` file, so that you can install them again by just running `npm install` later.

## Adding Content

Now that the project's meta files are in place, we can start adding the code that will be rendered when a visitor accesses the site. We will create an `index.html`, `style.css`, `main.js` and `update.js`.

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Parcel App</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <h1>Hello, World!</h1>
  <script src="./main.js"></script>
</body>
</html>
```

Our `index.html` will load the `./style.css` and `./main.js` files using normal `<link />` and `<script>` tags.

```
h1 {
  color: red;
  font-size: 5em;
}
```

Our `style.css` will just change the `<h1>` styles to be bigger and red.

```
import update from "./update.js";

update("Hello, Now");
```

```
export default (str) => document.querySelector("h1").innerText = str;
```

Our `main.js` will import `update.js` and call the exported function.

## Trying out the Code

Now let's see everything is workin. The `dev` script will run `parcel` in development mode where it will bundle the files without minifying them and setup Hot Module Reload and a development HTTP server. This can be run with the following command:

<TerminalInput>npm run dev</TerminalInput>

After this it will show you on your terminal the following output:

```
▲ parcel-app yarn dev
yarn run v1.5.1
warning package.json: No license field
$ parcel index.html
Server running at http://localhost:1234
✨  Built in 836ms.
```

You can now go to <http://localhost:1234> in your browser.

That's all! Now the application is **ready to be deployed**

## Deploying the App

Once the application works as expected, you can **deploy it** by running this command:

<TerminalInput>now</TerminalInput>

Once <Now color="#000" /> has finished uploading the files, you'll see a URL that points to your freshly created application. This means that you can already share the URL with other people across the globe and have them enjoy it.

But in the case of a real service (not used for testing purposes), you would now have to assign an <InternalLink href="/docs/features/aliases">alias</InternalLink> to it.

## Optional: Using Env & Secrets

Now comes with an easy to use [environment variables and secrets](/docs/features/env-and-secrets) support which lets you save secrets with a single command and then use them while deploying.

Parcel automatically detect the usage of environment variables inside the JavaScript code and inline the values without extra steps. So we can setup a secret like:

<TerminalInput>now secret bundler Parcel</TerminalInput>

And then change our deploy script to the command:

<TerminalInput>now -e BUNDLER=@bundler</TerminalInput>

Now we can made use of it inside our application code.

```js
import update from "./update.js";

update(`Hello, ${process.env.BUNDLER}`);
```

This will output `Hello, Parcel` inside our `<h1>`.

## Optional: Static Deployment

So far the deployment has been create a [Node.js deployment](/docs/deployment-types/node) and running `serve` as an HTTP server inside it. Doing this let us build our web application directly inside Now and made use of Now environment variables and secrets.

If you don't want to build inside Now (eg. [your are building inside your CI pipeline](/docs/continuous-integration/travis#optional:-avoid-building-on-now-(instead-build-on-travis))) and you don't want to use env and secrets you can let Parcel build your application locally and use Now only for a static deployment.

To do so we need to add a `now.json` file to setup how Now will treat our deployments.

```
{
  "type": "static",
  "files": [
    "./dist"
  ],
  "static": {
    "public": "/dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

The JSON file above configure our deployment to be `static`, only upload the `./dist` folder created by running `parcel build` and configure the deployment to serve the directory `/dist` and reply with the `index.html` for every request to a non-matching file (this let us support Single Page Applications).

Now let's deploy our application running the following command:

```
rm -r ./dist && npm run build && now
```

The command will remove the current `./dist` folder (to avoid uploading development and old files), build our application with `parcel` and upload and deploy the new the version of the web application.

export default withDoc({...meta})(({children}) => <>{children}</>)
