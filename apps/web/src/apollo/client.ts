import { ApolloClient, CombinedGraphQLErrors, from, HttpLink, InMemoryCache } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';

const uri = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql';

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const graphQLError of error.errors) {
      console.error(`[GraphQL error] ${operation.operationName}: ${graphQLError.message}`);
    }
    return;
  }
  console.error(`[Network error] ${operation.operationName}:`, error);
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, new HttpLink({ uri })]),
  cache: new InMemoryCache(),
});
