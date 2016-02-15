var path = require("path")
require("./src/server.js")

module.exports = {
  entry: [
    // 'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    "./example/index.jsx"
  ],
  output: {
    path: "./example",
    filename: "dist/bundle.js",
  },
  devtool: "inline-source-map",
  resolve: {
    root: [
      path.join(__dirname, "example"),
    ],
    alias: {
      "react-storyboard": path.join(__dirname, "./src/index.jsx")
    }
  },
  devServer: {
    contentBase: "./example"
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: "style-loader!css-loader!stylus-loader",
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      },
      {
        test:/\.jsx?$/,
        exclude: /^(node_modules)/,
        loaders: [
          // 'react-hot',
          'babel?stage=0',
        ],
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)|\.png($|\?)/,
        loader: "url-loader",
      },
    ],
  },
  plugins: [
  ]
}
