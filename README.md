## webpack

This project uses webpack in order to bundle multiply .js files in a single file. 

### Setup

Webpack-related packages were installed:
```bash
npm install webpack webpack-cli -D
```

Initial config was added:
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```


## babel

This project uses babel in order to transpile modern js code to older versions. 

### Setup

Babel-related packages were installed:
```bash
npm install @babel/core @babel/preset-env -D
```

Since babel is used through webpack the following steps are required:

```bash
npm instal babel-loader -D
```

Add a new section to the webpack config:

```js
module: {
  rules: [
    {
      test: /\.js$/, // Apply the following rules to .js files
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader', // Use babel-loader for transpiling
        options: {
          presets: ['@babel/preset-env'], // Use the @babel/preset-env preset
        },
      },
    },
  ],
}
```

## React 

```bash
npm install @babel/preset-react -D
```

## 


```bash
npm install html-webpack-plugin -D
```

```bash
npm install webpack-dev-server -D
```

- used so that when we make a change to a file inside our new app, we won’t need to refresh the page. 
- It refreshes the browser page automatically every time we change a file in our app
- as its name says, it’s a server that is working non-stop

Copy appsscript.json to dist

```bash
npm install copy-webpack-plugin -D
```

Inline js to html:
```bash
npm install html-webpack-inline-source-plugin -D
```
Actually the package above is deprecated, so the following one is required:
```bash
npm install @effortlessmotion/html-webpack-inline-source-plugin -D
```
(https://github.com/jantimon/html-webpack-plugin/issues/1379#issuecomment-1356655772)


Probably the following package is required for `global.`-related setup
```bash
npm install gas-webpack-plugin -D
```