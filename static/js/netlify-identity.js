// static/js/netlify-identity.module.js
import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init({
  APIUrl: 'https://sj-androidapp-may2024.netlify.app/.netlify/identity',
});

console.log(netlifyIdentity)

window.netlifyIdentity = netlifyIdentity;

