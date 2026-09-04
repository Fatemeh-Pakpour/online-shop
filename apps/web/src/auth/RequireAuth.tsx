import { withAuthenticationRequired } from '@auth0/auth0-react';
import type { ComponentType } from 'react';

/** Wraps a page so an anonymous visitor is sent to Auth0 before it renders. */
export const requireAuth = (Component: ComponentType): ComponentType =>
  withAuthenticationRequired(Component, {
    onRedirecting: () => <p className="state">Redirecting to sign in...</p>,
  });
