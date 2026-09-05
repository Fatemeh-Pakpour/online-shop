import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'auth:isPublic';

/**
 * Opts a resolver or a whole resolver class out of the global GqlAuthGuard.
 * Authentication is required by default, so anything unmarked stays protected.
 */
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC_KEY, true);
