import { useQuery } from "@apollo/client/react"
import { PRODUCTS_QUERY } from "./product-graphql"

export const useProduct = () => {
    const { loading, error, data } = useQuery(PRODUCTS_QUERY)
    console.log({ loading, error, data });

    return { loading, error, products: data?.products ?? [] };
}