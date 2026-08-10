
import type { Product } from "./product-graphql"

export const ProductItem = ({ product }: { product: Product }) => {
    return (
        <li className="product-item">
            <div>
                <h2>{product.name}</h2>
                <p>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(product.price)}</p>
            </div>
        </li>
    )
} 
