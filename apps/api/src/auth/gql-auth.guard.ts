import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AccessTokenService } from './access-token.service';
import { unauthenticated } from './auth-errors';
import { AuthUser } from './auth-user';
import { IS_PUBLIC_KEY } from './public.decorator';

/** Minimal shape needed off the request; avoids pulling express types into the app. */
interface GqlRequest {
  headers: { authorization?: string };
  user?: AuthUser;
}

/**
 * Requires a valid Auth0 access token on every GraphQL operation.
 * Registered globally in AuthModule, so unmarked operations fail closed;
 * mark deliberate exceptions with `@Public()`.
 */
@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenService: AccessTokenService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const { req } = GqlExecutionContext.create(context).getContext<{ req: GqlRequest }>();
    const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw unauthenticated('Missing bearer token.');
    }

    req.user = await this.accessTokenService.verify(token);
    return true;
  }
}
