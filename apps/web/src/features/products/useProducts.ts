import type { Reference } from "@apollo/client"
import { useMutation, useQuery } from "@apollo/client/react"
import {
    CATEGORIES_QUERY,
    CATEGORY_FIELD,
    CREATE_CATEGORY,
    CREATE_PRODUCT,
    PRODUCT_FIELD,
    PRODUCTS_QUERY,
    type Category,
    type CreateCategoryInput,
    type CreateProductInput,
} from "./product-graphql"

export const useProducts = () => {
    const { loading, error, data } = useQuery(PRODUCTS_QUERY)
    const {
        loading: categoriesLoading,
        error: categoriesError,
        data: categoriesData,
    } = useQuery(CATEGORIES_QUERY)

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

    const [createCategoryMutation, { loading: isCreatingCategory }] = useMutation(CREATE_CATEGORY, {
        update(cache, result) {
            const newCategory = result.data?.createCategory;
            if (!newCategory) return

            const newCategoryRef = cache.writeFragment({
                data: newCategory,
                fragment: CATEGORY_FIELD,
            });

            if (!newCategoryRef) return;

            cache.modify({
                fields: {
                    categories(existingCategoryRefs: readonly Reference[] = [], { readField }) {
                        const alreadyExists = existingCategoryRefs.some(
                            (categoryRef) => readField('id', categoryRef) === newCategory.id,
                        );

                        if (alreadyExists) return existingCategoryRefs;

                        return [...existingCategoryRefs, newCategoryRef];
                    },
                },
            })
        },
    })

    return {
        loading,
        error,
        products: data?.products ?? [],
        categoriesLoading,
        categoriesError,
        categories: categoriesData?.categories ?? [],
        isCreating,
        isCreatingCategory,
        createProduct: (input: CreateProductInput) => create({ variables: { input } }),
        createCategory: (input: CreateCategoryInput) =>
            createCategoryMutation({ variables: { input } }).then((result) => result.data?.createCategory as Category | undefined),
    };
}
