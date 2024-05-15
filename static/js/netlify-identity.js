// static/js/netlify-identity.module.js
import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init({
  APIUrl: NETLIFY_IDENTITY_URL ? NETLIFY_IDENTITY_URL : undefined,
});

netlifyIdentity.on('login', () => {
    window.location.reload();
});

window.netlifyIdentity = netlifyIdentity;

