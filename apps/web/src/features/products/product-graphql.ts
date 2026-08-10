import { gql, type TypedDocumentNode } from "@apollo/client";

export interface Product {
  __typename?: 'Product';
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
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

export const CREATE_PRODUCT: TypedDocumentNode<
  { createProduct: Product },
  { input: CreateProductInput }
> = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductField
    }
  }
  ${PRODUCT_FIELD}
`;
