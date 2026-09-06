import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AccessTokenService } from './access-token.service';
import { GqlAuthGuard } from './gql-auth.guard';

/**
 * Global because the guard it registers runs for every resolver in the app.
 * The token verifier is exported so services can be tested against it directly.
 */
@Global()
@Module({
  providers: [AccessTokenService, { provide: APP_GUARD, useClass: GqlAuthGuard }],
  exports: [AccessTokenService],
})
export class AuthModule { }
