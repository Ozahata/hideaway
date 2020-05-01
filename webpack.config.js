const path = require('path');
const merge = require('webpack-merge');

module.exports = function (env) {
  const isDevelopment = env === 'development';

  const baseConfig = {
    entry: { index: './src/index.ts' },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
      ],
    },
  };

  if (isDevelopment) {
    return merge(baseConfig, {});
  } else {
    return merge(baseConfig, {
      devtool: false,
    });
  }
};
