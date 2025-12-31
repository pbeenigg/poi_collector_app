const path = require('path');

module.exports = {
  target: 'electron-main',
  entry: './src/main/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@main': path.resolve(__dirname, 'src/main'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3',
    'electron-store': 'commonjs electron-store',
  },
};
