import { gql, type TypedDocumentNode } from "@apollo/client";

export interface Product {
    __typename?: 'Product';
    id: string;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

const PRODUCT_FIELD = gql`
  fragment ProductField on Product {
    id
    name
    price
    updatedAt
    createdAt
  }
`;

export const PRODUCTS_QUERY: TypedDocumentNode<{ products: Product[] }> = gql`
  query Products {
    products {
      ...ProductField
    }
  }
  ${PRODUCT_FIELD}
`;
