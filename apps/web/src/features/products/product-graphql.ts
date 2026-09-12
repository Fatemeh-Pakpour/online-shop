import { gql, type TypedDocumentNode } from "@apollo/client";

export interface Product {
  __typename?: 'Product';
  id: string;
  name: string;
  price: number;
  categoryId?: string | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  __typename?: 'Category';
  id: string;
  name: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  categoryId?: string;
}

export interface CreateCategoryInput {
  name: string;
}

export const PRODUCT_FIELD = gql`
  fragment ProductField on Product {
    id
    name
    price
    categoryId
    category {
      id
      name
    }
    updatedAt
    createdAt
  }
`;

export const CATEGORY_FIELD = gql`
  fragment CategoryField on Category {
    id
    name
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

export const CATEGORIES_QUERY: TypedDocumentNode<{ categories: Category[] }> = gql`
  query Categories {
    categories {
      ...CategoryField
    }
  }
  ${CATEGORY_FIELD}
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

export const CREATE_CATEGORY: TypedDocumentNode<
  { createCategory: Category },
  { input: CreateCategoryInput }
> = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryField
    }
  }
  ${CATEGORY_FIELD}
`;
