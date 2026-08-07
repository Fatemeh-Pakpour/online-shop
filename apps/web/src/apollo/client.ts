import { ApolloLink, InMemoryCache } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

// HttpLink - a customized Apollo Link that knows how to execute network requests against a GraphQL server.

// Uniform Resource Identifier)
// cache is an instance of InMemoryCache, which Apollo Client uses to cache query results after fetching them.
const uri = import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:3000/graphql"

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const graphQLError of error.errors) {
      console.error(`[GraphQL error] ${operation.operationName}: ${graphQLError.message}`);
    }
    return;
  }
  console.error(`[Network error] ${operation.operationName}:`, error);
});

const link = ApolloLink.from([
  errorLink,
  new HttpLink({ uri }),
]);


export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache()

})