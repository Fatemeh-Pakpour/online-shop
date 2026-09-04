import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, type PropsWithChildren } from 'react';

import { setAccessTokenGetter } from './access-token';

/** Hands the Apollo link chain a way to fetch the current access token. */
export const AccessTokenBridge = ({ children }: PropsWithChildren) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    setAccessTokenGetter(async () => {
      if (!isAuthenticated) return null;
      try {
        return await getAccessTokenSilently();
      } catch (error) {
        // login_required / consent_required: fall back to an anonymous request
        // so public queries keep working instead of the whole page erroring.
        console.warn('Could not get an access token silently:', error);
        return null;
      }
    });
  }, [getAccessTokenSilently, isAuthenticated]);

  return <>{children}</>;
};
