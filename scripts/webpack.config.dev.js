const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.config.common');

const genConfig = ({
  entry, filename, library, libraryTarget,
}) => ({
  ...common,
  mode: 'development',
  entry,
  output: {
    filename,
    library,
    libraryTarget,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        TESS_ENV: JSON.stringify('development'),
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disable',
      statsFilename: `${filename.split('.')[0]}-stats.json`,
      generateStatsFile: true
    }),
  ],
  devServer: {
    allowedHosts: ['localhost', '.gitpod.io'],
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'bundle.css',
          },
        },
        { loader: 'extract-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader',
          options: {
             plugins: () => [autoprefixer({ grid: false, 'browsers': ['> 1%', 'last 2 versions'] })]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: [
                ['./node_modules']
              ]
            }
          }
        },
      ]
    }]
  }
});

module.exports = [
  genConfig({
    entry: path.resolve(__dirname, '..', 'src', 'index.js'),
    filename: 'tesseract.dev.js',
    library: 'Tesseract',
    libraryTarget: 'umd',
  }),
  genConfig({
    entry: path.resolve(__dirname, '..', 'src', 'worker-script', 'browser', 'index.js'),
    filename: 'worker.dev.js',
  }),
  {
    entry: path.resolve(__dirname, '..', 'src', 'home.js'),
    output: {
      filename: "bundle-home.js",
      path: path.resolve(__dirname, '..', 'dist')
    },
    target: 'node',
    module: {
      rules: [{
        test: /home.js$/,
        loader: 'babel-loader',
        query: {presets: ['env']}
      }]
    }
  }
];

module.exports.push({
  mode: 'development',
  entry: path.resolve(__dirname, '..', 'src', 'app.scss'),
  output: {
    filename: 'style-bundle.js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'bundle.css',
          },
        },
        { loader: 'extract-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader',
          options: {
             plugins: () => [autoprefixer({ grid: false, 'browsers': ['> 1%', 'last 2 versions'] })]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: [
                ['node_modules']
              ]
            }
          }
        },
      ]
    }]
  }
});
