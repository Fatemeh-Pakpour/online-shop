export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
};

export const isAuth0Configured =
  Boolean(auth0Config.domain) &&
  Boolean(auth0Config.clientId) &&
  Boolean(auth0Config.audience);
