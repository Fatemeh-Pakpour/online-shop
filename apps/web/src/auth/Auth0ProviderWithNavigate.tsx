import { Auth0Provider, type AppState } from '@auth0/auth0-react';
import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';

import { AccessTokenBridge } from './AccessTokenBridge';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
// Must match AUTH0_AUDIENCE on the API, otherwise Auth0 returns an opaque
// token the backend cannot verify.
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export const Auth0ProviderWithNavigate = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  if (!domain || !clientId || !audience) {
    throw new Error(
      'Missing Auth0 config. Set VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID and VITE_AUTH0_AUDIENCE in apps/web/.env',
    );
  }

  // Auth0 redirects back to the app origin; restore the route the user wanted.
  const onRedirectCallback = (appState?: AppState) => {
    void navigate(appState?.returnTo ?? window.location.pathname, { replace: true });
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      // Refresh tokens avoid depending on third-party cookies, which Safari and
      // friends block. Tokens stay in memory: add cacheLocation="localstorage"
      // to survive a page reload, at the cost of exposing them to XSS.
      useRefreshTokens
      onRedirectCallback={onRedirectCallback}
    >
      <AccessTokenBridge>{children}</AccessTokenBridge>
    </Auth0Provider>
  );
};
