const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const NAME = 'planting-course';

const filename = (name = 'bundle', ext) =>
  isDev ? `${name}.${ext}` : `${name}.[hash].${ext}`;

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['./js/index.js'],
  output: {
    filename: `${NAME}/js/${filename(NAME, 'js')}`,
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev,
    compress: true,
    progress: true,
    watchContentBase: true,
    index: `${NAME}.html`,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'template.html',
      filename: `${NAME}.html`,
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/img'),
          to: path.resolve(__dirname, `dist/${NAME}/img`),
        },
        {
          from: path.resolve(__dirname, 'src/fonts'),
          to: path.resolve(__dirname, `dist/${NAME}/fonts`),
        },
        {
          from: path.resolve(__dirname, 'src/favicon'),
          to: path.resolve(__dirname, `dist/${NAME}/img/favicon`),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `${NAME}/css/${filename(NAME, 'css')}`,
    }),
    new BrowserSyncPlugin(
      {
        open: false,
        notify: false,
        host: 'localhost',
        port: 3100,
        proxy: 'http://localhost:3000/',
        tunnel: true,
      },
      {
        reload: false,
      },
    ),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                sourceMap: true,
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
