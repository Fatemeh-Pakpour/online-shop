import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_PRODUCT, PRODUCTS_QUERY, type CreateProductInput } from "./product-graphql"

export const useProducts = () => {
    const { loading, error, data } = useQuery(PRODUCTS_QUERY)

    const [create, { loading: isCreating }] = useMutation(CREATE_PRODUCT, {
        update(cache, result) {
            const newProduct = result.data?.createProduct;
            if (!newProduct) return
            cache.updateQuery({ query: PRODUCTS_QUERY }, (existing) => existing
                ? { products: [newProduct, ...existing.products] } : { products: [newProduct] })

        }
    })



    return { loading, error, products: data?.products ?? [], isCreating, createProcuct: (input: CreateProductInput) => create({ variables: { input } }) };
}
