import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { graphqlRequest } from '../../graphql/request';
import { CREATE_PRODUCT, PRODUCTS_QUERY, type CreateProductInput, type Product } from './product-graphql';

type ProductsData = {
  products: Product[];
};

export const productsQueryKey = ['products'] as const;

export const useProductsTanstack = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: productsQueryKey,
    queryFn: () => graphqlRequest<ProductsData>(PRODUCTS_QUERY),
  });

  const createProductMutation = useMutation({
    mutationFn: (input: CreateProductInput) =>
      graphqlRequest<{ createProduct: Product }, { input: CreateProductInput }>(CREATE_PRODUCT, { input }),
    onSuccess: ({ createProduct }) => {
      queryClient.setQueryData<ProductsData>(productsQueryKey, (existing) => {
        if (!existing) return { products: [createProduct] };

        const alreadyExists = existing.products.some((product) => product.id === createProduct.id);
        if (alreadyExists) return existing;

        return {
          products: [createProduct, ...existing.products],
        };
      });
    },
  });

  return {
    loading: productsQuery.isPending,
    error: productsQuery.error,
    products: productsQuery.data?.products ?? [],
    isCreating: createProductMutation.isPending,
    createProduct: (input: CreateProductInput) => createProductMutation.mutateAsync(input),
  };
};
