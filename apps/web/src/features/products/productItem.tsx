
import type { Product } from "./product-graphql"
import { useCartStore } from "../../stores/cartStore"

export const ProductItem = ({ product }: { product: Product }) => {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <li className="product-item">
            <div>
                <h2>{product.name}</h2>
                <p>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(product.price)}</p>
            </div>
            <button
                className="button"
                type="button"
                onClick={() =>
                    addItem({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                    })
                }
            >
                Add to cart
            </button>
        </li>
    )
} 
