import { ProductForm } from "../../components/Product/ProductForm";
import { useCartStore } from "../../stores/cartStore";
import { ProductItem } from "./productItem";
import { useProducts } from "./useProducts"

export const ProductsPage = () => {
    const { products, error, loading } = useProducts();
    const itemCount = useCartStore((state) => state.itemCount());
    const totalPrice = useCartStore((state) => state.totalPrice());

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1>Products</h1>
                    <p className="page-subtitle">{products.length} total</p>
                </div>
                <div className="cart-summary" aria-label="Cart summary">
                    <span>{itemCount} in cart</span>
                    <strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(totalPrice)}</strong>
                </div>
            </header>

            {loading && <p className="state">Loading products...</p>}
            {error && <p className="state state-error">Could not load products: {error.message}</p>}
            {!loading && !error && products.length === 0 && <p className="state">No products yet.</p>}
            <ProductForm />
            <ul className="product-list">
                {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </ul>
        </main>
    )
}
