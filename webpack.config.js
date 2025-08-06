const webpack = require('webpack');

module.exports = {
  // ... suas outras configurações do webpack ...
  resolve: {
    fallback: {
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "fs": false, // fs não funciona no browser, pode deixar false
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      // adicione mais conforme os erros indicarem
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
