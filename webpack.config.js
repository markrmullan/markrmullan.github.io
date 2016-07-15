module.exports = {
  entry: "./lib/galaga.js",
  output: {
  	filename: "./lib/bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  }
};
