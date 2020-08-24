const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "src/index.js"), // 入口文件
  },
  output: {
    path: path.join(__dirname, "dist"), // bundle 生成目录
    publicPath: "/",
    filename: "js/[name]-[hash]" + ".js",
    chunkFilename: "js/[name]-[hash]" + ".js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "eslint-loader",
            options: {
              formatter: require("eslint-friendly-formatter"),
              emitWarning: false,
            },
          },
        ],
      },
      {
        test: /\.(css | less)&/,
        exclude: /node_modules/,
        include: /src/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              minimize: process.env.NODE_ENV === "production",
              importLoaders: 2,
              localIdentName: "[name]-[local]-[hash:base64:5]",
              modules: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: (loader) => [require("autoprefixer")()],
            },
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        include: /src/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: process.env.NODE_ENV === "production",
                importLoaders: 2,
                localIdentName: "[name]-[local]-[hash:base64:5]",
                module: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: (loader) => [require("autoprefixer")()],
              },
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        }),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "static/img/[name].[hash:7].[ext]",
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "static/media/[name].[hash:7].[ext]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "static/fonts/[name].[hash:7].[ext]",
        },
      },
    ],
  },
  plugins: [
    new ExtractTextWebpackPlugin({
      filename: "css/[name]-[hash].css",
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      allChunks: true,
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      filename: "index.html",
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: path.join(__dirname, "./src/static"),
            to: "static",
            // ignore: [".*"],
          },
        ],
      },
    ),
  ],
  optimization: {
    /*splitChunks: {
        chunks: 'all',//"initial" | "async" | "all"
        cacheGroups: {
            default: false,
            vendors: false,
        },
    },*/
    /*splitChunks: {
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor",
                chunks: "all"
            }
        }
    }*/
    runtimeChunk: {
      name: "manifest",
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  devServer: {
    // contentBase: path.join(__dirname, ""),
    contentBase: false, //since we use CopyWebpackPlugin.
    clientLogLevel: "warning",
    publicPath: "/",
    hot: true,
    progress: true,
    overlay: { warnings: false, errors: true },
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: path.posix.join("/", "index.html") }],
    },
    // historyApiFallback: true,
    // quiet: true, // necessary for FriendlyErrorsPlugin
    compress: true,
    inline: true,
    port: 8083,
    host: "0.0.0.0",
    watchOptions: {
      poll: false,
    },
  },
};
