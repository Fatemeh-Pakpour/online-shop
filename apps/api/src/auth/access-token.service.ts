import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

import { AuthUser } from './auth-user';
import { unauthenticated } from './auth-errors';

/** Verifies Auth0 access tokens against the tenant's rotating public keys. */
@Injectable()
export class AccessTokenService {
  private readonly logger = new Logger(AccessTokenService.name);
  /** Fetches and caches the tenant JWKS, refreshing when an unknown key id appears. */
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly issuer: string;
  private readonly audience: string;

  constructor(config: ConfigService) {
    const issuerBaseUrl = config.getOrThrow<string>('AUTH0_ISSUER_BASE_URL');
    // Auth0 mints the `iss` claim with a trailing slash; normalise so comparison never drifts.
    this.issuer = issuerBaseUrl.endsWith('/') ? issuerBaseUrl : `${issuerBaseUrl}/`;
    this.audience = config.getOrThrow<string>('AUTH0_AUDIENCE');
    this.jwks = createRemoteJWKSet(new URL('.well-known/jwks.json', this.issuer));
  }

  async verify(token: string): Promise<AuthUser> {
    let payload: JWTPayload;
    try {
      ({ payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: ['RS256'],
      }));
    } catch (error) {
      // The reason is useful in logs but must not reach the client.
      this.logger.debug(`Access token rejected: ${(error as Error).message}`);
      throw unauthenticated('Invalid or expired access token.');
    }

    if (typeof payload.sub !== 'string') {
      throw unauthenticated('Access token is missing a subject.');
    }

    return {
      sub: payload.sub,
      scopes: typeof payload.scope === 'string' ? payload.scope.split(' ').filter(Boolean) : [],
      permissions: Array.isArray(payload.permissions)
        ? payload.permissions.filter((value): value is string => typeof value === 'string')
        : [],
    };
  }
}
