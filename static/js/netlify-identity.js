// static/js/netlify-identity.module.js
import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init({
  APIUrl: NETLIFY_IDENTITY_URL ? NETLIFY_IDENTITY_URL : undefined,
});

console.log(netlifyIdentity)
console.log("NETLIFY_IDENTITY_URL", NETLIFY_IDENTITY_URL)

window.netlifyIdentity = netlifyIdentity;

