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
          'NETLIFY_IDENTITY_URL': (process.env.NETLIFY_IDENTITY_URL ?  JSON.stringify(`https://${process.env.SITE_ID}.netlify.app/.netlify/identity`) : undefined)
        })
      ]
  };