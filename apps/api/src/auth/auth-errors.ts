import { GraphQLError } from 'graphql';

/** Matches the error shape Apollo Client checks for when a session has lapsed. */
export const unauthenticated = (message: string): GraphQLError =>
  new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED' } });
