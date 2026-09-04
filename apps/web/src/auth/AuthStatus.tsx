import { useAuth0 } from '@auth0/auth0-react';

/** Sign in / sign out control with the current user's name. */
export const AuthStatus = () => {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  if (isLoading) return <span className="auth-status">Checking session...</span>;

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        className="button"
        onClick={() => void loginWithRedirect({ appState: { returnTo: window.location.pathname } })}
      >
        Sign in
      </button>
    );
  }

  return (
    <span className="auth-status">
      <span className="auth-user">{user?.name ?? user?.email}</span>
      <button
        type="button"
        className="button button-ghost"
        onClick={() => void logout({ logoutParams: { returnTo: window.location.origin } })}
      >
        Sign out
      </button>
    </span>
  );
};
