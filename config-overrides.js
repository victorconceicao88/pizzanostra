const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    zlib: require.resolve('browserify-zlib'),
    assert: require.resolve('assert/'),
    process: require.resolve('process/browser.js'), // <-- AQUI o .js é necessário
    buffer: require.resolve('buffer/'),
    fs: false,
    child_process: false,
    net: false,
    tls: false
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // <-- AQUI também
      Buffer: ['buffer', 'Buffer']
    })
  ];

  return config;
};
