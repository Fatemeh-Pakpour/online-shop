import { ProductForm } from "../../components/Product/ProductForm";
import { ProductItem } from "./productItem";
import { useProducts } from "./useProducts"

export const ProductsPage = () => {
    const { products, error, loading } = useProducts();

    return (
        <main className="page">
            <header className="page-header">
                <h1>Products</h1>
                <p className="page-subtitle">{products.length} total</p>
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
