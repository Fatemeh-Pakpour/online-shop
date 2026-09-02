import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_PRODUCT, PRODUCTS_QUERY, type CreateProductInput } from "./product-graphql"

export const useProducts = () => {
    const { loading, error, data } = useQuery(PRODUCTS_QUERY)

    const [create, { loading: isCreating }] = useMutation(CREATE_PRODUCT, {
        update(cache, result) {
            const newProduct = result.data?.createProduct;
            if (!newProduct) return

            cache.updateQuery({ query: PRODUCTS_QUERY }, (existing) => {
                if (!existing) return { products: [newProduct] };

                const alreadyExists = existing.products.some(
                    (product) => product.id === newProduct.id,
                );

                if (alreadyExists) return existing;

                return { products: [newProduct, ...existing.products] };
            })

        }
    })



    return { loading, error, products: data?.products ?? [], isCreating, createProduct: (input: CreateProductInput) => create({ variables: { input } }) };
}
