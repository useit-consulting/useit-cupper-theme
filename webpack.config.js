const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: './static/js/netlify-identity.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'static/js')
    },
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
          'NETLIFY_IDENTITY_URL': (process.env.SITE_NAME ?  JSON.stringify(`https://${process.env.SITE_NAME}.netlify.app/.netlify/identity`) : undefined)
        })
      ]
  };