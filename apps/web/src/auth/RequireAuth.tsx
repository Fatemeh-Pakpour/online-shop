import { withAuthenticationRequired } from '@auth0/auth0-react';
import type { ComponentType } from 'react';

import { isAuth0Configured } from './auth-config';

/** Wraps a page so an anonymous visitor is sent to Auth0 before it renders. */
export const requireAuth = (Component: ComponentType): ComponentType =>
  isAuth0Configured
    ? withAuthenticationRequired(Component, {
      onRedirecting: () => <p className="state">Redirecting to sign in...</p>,
    })
    : () => (
      <main className="page">
        <p className="state state-error">
          Auth0 is not configured. Add VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID,
          and VITE_AUTH0_AUDIENCE to apps/web/.env, then restart the dev server.
        </p>
      </main>
    );
