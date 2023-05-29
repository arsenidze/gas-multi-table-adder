# Multi table adder

## Overview

The project contains google apps script that allows adding data to multiple google spreadsheets at once.  

## Usage flow

At first, a user has to create a fillable template.
The fillable template contains the following elements:
- A list of spreadsheets to fill; the user specifies a spreadsheet and a sheet inside this spreadsheet using the spreadsheet's URL.
- A list of fields that should be added to spreadsheets.
- A mapping between columns of each spreadsheet and the fields; some fields can only be mapped to columns of a subset of spreadsheets.

Once the fillable template is ready, the user can utilize it.  
Using the template involves providing values to the fields specified in the template.  
When values are provided and the user presses the apply button, the values are added to the corresponding columns of the respective spreadsheets.

A user can have several fillable templates.


## Project structure



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