import type { Reference } from "@apollo/client"
import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_PRODUCT, PRODUCT_FIELD, PRODUCTS_QUERY, type CreateProductInput } from "./product-graphql"

export const useProducts = () => {
    const { loading, error, data } = useQuery(PRODUCTS_QUERY)

    const [create, { loading: isCreating }] = useMutation(CREATE_PRODUCT, {
        update(cache, result) {
            const newProduct = result.data?.createProduct;
            if (!newProduct) return

            const newProductRef = cache.writeFragment({
                data: newProduct,
                fragment: PRODUCT_FIELD,
            });

            if (!newProductRef) return;

            cache.modify({
                fields: {
                    products(existingProductRefs: readonly Reference[] = [], { readField }) {
                        const alreadyExists = existingProductRefs.some(
                            (productRef) => readField('id', productRef) === newProduct.id,
                        );

                        if (alreadyExists) return existingProductRefs;

                        return [newProductRef, ...existingProductRefs];
                    },
                },
            })

        }
    })



    return { loading, error, products: data?.products ?? [], isCreating, createProduct: (input: CreateProductInput) => create({ variables: { input } }) };
}
