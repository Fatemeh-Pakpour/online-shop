import { useQuery } from "@apollo/client/react"
import { PRODUCTS_QUERY } from "./product-graphql"

export const useProducts = () => {
    const { loading, error, data } = useQuery(PRODUCTS_QUERY)

    return { loading, error, products: data?.products ?? [] };
}
