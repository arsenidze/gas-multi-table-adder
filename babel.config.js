module.exports = {
  presets: [
    "@babel/preset-env",
    [
      "@babel/preset-react", {
        // https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#manual-babel-setup
        "runtime": "automatic"
      }
    ]
  ],
};