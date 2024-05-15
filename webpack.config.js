const path = require('path');

module.exports = {
    entry: './static/js/netlify-identity.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'static/js')
    },
    mode: 'production'
  };