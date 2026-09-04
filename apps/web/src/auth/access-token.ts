/**
 * Bridges the Auth0 React context to the Apollo link chain.
 *
 * The Apollo client is created once at module scope, outside React, so it cannot
 * call `useAuth0()` itself. `AccessTokenBridge` registers the live getter here
 * once the provider has mounted, and the auth link reads it per request.
 */
type AccessTokenGetter = () => Promise<string | null>;

let getAccessTokenFromAuth0: AccessTokenGetter = async () => null;

export const setAccessTokenGetter = (getter: AccessTokenGetter): void => {
  getAccessTokenFromAuth0 = getter;
};

/** Resolves to null when nobody is signed in, so public queries still go out. */
export const getAccessToken = (): Promise<string | null> => getAccessTokenFromAuth0();
