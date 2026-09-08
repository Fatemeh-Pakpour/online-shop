import type { TypedDocumentNode } from '@apollo/client';
import { print } from 'graphql';

import { getAccessToken } from '../auth/access-token';

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: { message: string }[];
};

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql';

export async function graphqlRequest<TData, TVariables = Record<string, never>>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
): Promise<TData> {
  const token = await getAccessToken();
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  });

  const result = (await response.json()) as GraphQLResponse<TData>;

  if (!response.ok || result.errors?.length) {
    throw new Error(result.errors?.[0]?.message ?? `GraphQL request failed: ${response.status}`);
  }

  if (!result.data) {
    throw new Error('GraphQL response did not include data.');
  }

  return result.data;
}
