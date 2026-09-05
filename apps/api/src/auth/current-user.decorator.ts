import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthUser } from './auth-user';

/**
 * Injects the verified caller into a resolver argument.
 * Undefined on `@Public()` operations, where no token is required.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined => {
    const { req } = GqlExecutionContext.create(context).getContext<{ req: { user?: AuthUser } }>();
    return req.user;
  },
);
