import type { Product } from "./product-graphql"

export const ProductItem = ({ name, price }: Product) => {
    return (
        <div>
            <h2>{name}</h2>
            <div>{price}</div>
        </div>
    )
} 