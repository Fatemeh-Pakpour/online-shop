import { Auth0Provider, type AppState } from '@auth0/auth0-react';
import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';

import { AccessTokenBridge } from './AccessTokenBridge';
import { auth0Config, isAuth0Configured } from './auth-config';

export const Auth0ProviderWithNavigate = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  if (!isAuth0Configured) return children;

  // Auth0 redirects back to the app origin; restore the route the user wanted.
  const onRedirectCallback = (appState?: AppState) => {
    void navigate(appState?.returnTo ?? window.location.pathname, { replace: true });
  };

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        // Must match AUTH0_AUDIENCE on the API, otherwise Auth0 returns an
        // opaque token the backend cannot verify.
        audience: auth0Config.audience,
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
