/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const environment = require('./configuration/environment');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const templateFiles = fs.readdirSync(environment.paths.source)
  .filter((file) => path.extname(file).toLowerCase() === '.html');

const htmlPluginEntries = templateFiles.map((template) => new HTMLWebpackPlugin({
  inject: true,
  hash: false,
  filename: template,
  template: path.resolve(environment.paths.source, template),
  meta: {
    viewport: environment.viewport,
  },
}));

module.exports = {
  entry: {
    app: path.resolve(environment.paths.source, 'js', 'app.js'),
  },
  output: {
    filename: 'js/[name].js',
    path: environment.paths.output,
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images
          }
        },
        generator: {
          filename: 'images/[name][ext]'
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.fonts
          }
        },
        generator: {
          filename: 'fonts/[hash][ext][query]'
        },
      },
      {
        test: /\.html$/i,
        use: {
          loader: 'html-loader',
          options: {
            sources: {
              list: [
                // All default supported tags and attributes
                '...',
                {
                  tag: 'div',
                  attribute: 'data-background-image',
                  type: 'src',
                },
              ],
            },
            preprocessor: (content, loaderContext) =>
              content.replace(
                /<include src="(.+)"\s*\/?>(?:<\/include>)?/gi,
                (m, src) => {
                  const filePath = path.resolve(loaderContext.context, src)
                  loaderContext.dependency(filePath)
                  return fs.readFileSync(filePath, 'utf8')
                }
              ),
          },
        },
      }, 
    ],
  },
  plugins: [
    new WebpackBar(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),
    new FaviconsWebpackPlugin({
      logo: environment.favicon,
      prefix: 'images/favicons/',
      favicons: {
        appName: environment.site_name,
        appDescription: environment.site_description,
        developerName: null,
        developerURL: null,
        manifestRelativePaths: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false,
        },
      },
    }), 
  ].concat(htmlPluginEntries),
  target: 'web',
};
