
import type { Product } from "./product-graphql"
import { useCartStore } from "../../stores/cartStore"
import { useWishlistStore } from "../../stores/wishlistStore"

export const ProductItem = ({ product }: { product: Product }) => {
    const addItem = useCartStore((state) => state.addItem);
    const isWishlisted = useWishlistStore((state) => state.hasItem(product.id));
    const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
    const categoryName = product.category?.name ?? 'No category';

    return (
        <li className={`product-item${isWishlisted ? ' is-wishlisted' : ''}`}>
            <div>
                <h2>{product.name}</h2>
                <p>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(product.price)}</p>
                <p className="product-category">{categoryName}</p>
            </div>
            <div className="product-actions">
                <button
                    className="button button-secondary"
                    type="button"
                    aria-pressed={isWishlisted}
                    onClick={() =>
                        toggleWishlistItem({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            categoryName,
                        })
                    }
                >
                    {isWishlisted ? 'Saved' : 'Save'}
                </button>
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
            </div>
        </li>
    )
} 
