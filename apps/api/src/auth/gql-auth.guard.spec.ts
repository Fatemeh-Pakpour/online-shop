// jose is ESM-only and this suite runs under CommonJS. An explicit factory keeps
// Jest from loading the real module; the guard never calls it anyway.
jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccessTokenService } from './access-token.service';
import { AuthUser } from './auth-user';
import { GqlAuthGuard } from './gql-auth.guard';

interface TestRequest {
  headers: { authorization?: string };
  user?: AuthUser;
}

const user: AuthUser = { sub: 'auth0|1', scopes: [], permissions: [] };

const contextFor = (req: TestRequest): ExecutionContext =>
  ({
    getHandler: () => () => undefined,
    getClass: () => class { },
    getType: () => 'graphql',
    getArgs: () => [undefined, undefined, { req }, undefined],
    getArgByIndex: (index: number) => [undefined, undefined, { req }, undefined][index],
  }) as unknown as ExecutionContext;

describe('GqlAuthGuard', () => {
  let accessTokenService: { verify: jest.Mock };
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: GqlAuthGuard;

  beforeEach(() => {
    accessTokenService = { verify: jest.fn().mockResolvedValue(user) };
    reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    guard = new GqlAuthGuard(
      reflector as unknown as Reflector,
      accessTokenService as unknown as AccessTokenService,
    );
  });

  it('rejects an operation with no Authorization header', async () => {
    await expect(guard.canActivate(contextFor({ headers: {} }))).rejects.toThrow(
      'Missing bearer token.',
    );
    expect(accessTokenService.verify).not.toHaveBeenCalled();
  });

  it('rejects a non-bearer Authorization scheme', async () => {
    const context = contextFor({ headers: { authorization: 'Basic abc123' } });

    await expect(guard.canActivate(context)).rejects.toThrow('Missing bearer token.');
    expect(accessTokenService.verify).not.toHaveBeenCalled();
  });

  it('verifies the token and attaches the caller to the request', async () => {
    const req: TestRequest = { headers: { authorization: 'Bearer token-abc' } };

    await expect(guard.canActivate(contextFor(req))).resolves.toBe(true);
    expect(accessTokenService.verify).toHaveBeenCalledWith('token-abc');
    expect(req.user).toEqual(user);
  });

  it('lets a @Public() operation through without a token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    await expect(guard.canActivate(contextFor({ headers: {} }))).resolves.toBe(true);
    expect(accessTokenService.verify).not.toHaveBeenCalled();
  });
});
