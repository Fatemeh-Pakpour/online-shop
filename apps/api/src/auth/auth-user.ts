/** The authenticated caller, derived from a verified Auth0 access token. */
export interface AuthUser {
  /** Auth0 user id, e.g. "auth0|65f0...". Stable across sessions. */
  sub: string;
  /** Scopes granted to the token, split from the space-delimited `scope` claim. */
  scopes: string[];
  /** Permissions from the `permissions` claim. Empty unless RBAC is enabled on the API. */
  permissions: string[];
}
