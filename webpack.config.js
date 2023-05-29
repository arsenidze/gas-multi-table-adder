const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('@effortlessmotion/html-webpack-inline-source-plugin');
const GasPlugin = require('gas-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const CLIENT_DIR = path.join(SRC_DIR, 'client');
const SERVER_DIR = path.join(SRC_DIR, 'server');
const CLIENT_ENTRY = path.join(CLIENT_DIR, 'index.js');
const SERVER_ENTRY = path.join(SERVER_DIR, 'index.js');

const clientConfig = {
  mode: process.env.NODE_ENV || 'development',
  devtool: IS_PROD ? undefined : 'inline-source-map',
  entry: CLIENT_ENTRY,
  output: {
    filename: 'client.js',
    path: DIST_DIR,
    publicPath: '/',
    // clean: true,
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      ...(IS_PROD && {
        inlineSource: '.(js|css)$',
        inject: 'body'
      }),
    }),
    IS_PROD && new HtmlWebpackInlineSourcePlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'appsscript.json'),
          to: path.resolve(__dirname, 'dist', 'appsscript.json')
        },
        {
          from: path.join(__dirname, 'src', 'server', 'index.js'),
          to: path.join(__dirname, 'dist', 'server.js')
        },
      ],
    }),
  ].filter(Boolean),
};

// const serverConfig = {
//   mode: 'development',
//   entry: SERVER_ENTRY, // TODO: rename
//   output: {
//     filename: 'server.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   // devServer: {
//   //   contentBase: path.join(__dirname, 'src')
//   // },
//   // module: {
//   //   rules: [
//   //     {
//   //       test: /\.(js)$/,
//   //       exclude: /node_modules/,
//   //       use: [
//   //         'babel-loader'
//   //       ]
//   //     },
//   //   ],
//   // },

//   plugins: [
//     new CopyPlugin({
//       patterns: [
//         {
//           from: path.resolve(__dirname, 'appsscript.json'),
//           to: path.resolve(__dirname, 'dist', 'appsscript.json')
//         },
//         {
//           from: path.join(__dirname, 'src', 'server', 'index.js'),
//           to: path.join(__dirname, 'dist', 'server.js')
//         },
//       ],
//     }),
//     // new GasPlugin({
//     //   comments: false,
//     //   autoGlobalExportsFiles: [path.join(SERVER_DIR, '*.js')],
//     // })
//   ]
// };

module.exports = [
  clientConfig,
  // serverConfig,
]
