var path = require("path")

module.exports = {
  entry: [
    "./src/index.jsx"
  ],
  output: {
    path: "./",
    filename: "dist/react-storyboard.js",
  },
  devtool: "inline-source-map",
  resolve: {
    root: [
      path.join(__dirname, "src"),
    ],
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
        exclude: /^(node_modules|dist|scripts|assets)/,
        include: path.join(__dirname, 'src'),
        loaders: [
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
