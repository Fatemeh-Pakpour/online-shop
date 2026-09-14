import { useMemo, useState, type SubmitEventHandler } from "react";

import { ProductForm } from "../../components/Product/ProductForm";
import { useCartStore } from "../../stores/cartStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import { ProductItem } from "./productItem";
import { useProducts } from "./useProducts"

export const ProductsPage = () => {
    const {
        products,
        error,
        loading,
        categories,
        categoriesError,
        categoriesLoading,
        isCreating,
        isCreatingCategory,
        createProduct,
        createCategory,
    } = useProducts();
    const cartItems = useCartStore((state) => state.items);
    const itemCount = useCartStore((state) => state.itemCount());
    const totalPrice = useCartStore((state) => state.totalPrice());
    const removeCartItem = useCartStore((state) => state.removeItem);
    const clearCart = useCartStore((state) => state.clearCart);
    const wishlistItems = useWishlistStore((state) => state.items);
    const removeWishlistItem = useWishlistStore((state) => state.removeItem);
    const clearWishlist = useWishlistStore((state) => state.clearWishlist);
    const [categoryName, setCategoryName] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortMode, setSortMode] = useState('newest');
    const [showSavedOnly, setShowSavedOnly] = useState(false);
    const visibleProducts = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const savedProductIds = new Set(
            wishlistItems.map((item) => item.productId),
        );

        const filteredProducts = products.filter((product) => {
            if (showSavedOnly && !savedProductIds.has(product.id)) {
                return false;
            }

            const matchesCategory =
                categoryFilter === 'all' ||
                (categoryFilter === 'uncategorized' && !product.categoryId) ||
                product.categoryId === categoryFilter;

            if (!matchesCategory) return false;
            if (!normalizedSearch) return true;

            const categoryName = product.category?.name ?? '';
            return `${product.name} ${categoryName}`.toLowerCase().includes(normalizedSearch);
        });

        return [...filteredProducts].sort((firstProduct, secondProduct) => {
            if (sortMode === 'name') {
                return firstProduct.name.localeCompare(secondProduct.name);
            }

            if (sortMode === 'price-low') {
                return firstProduct.price - secondProduct.price;
            }

            if (sortMode === 'price-high') {
                return secondProduct.price - firstProduct.price;
            }

            return Date.parse(secondProduct.createdAt) - Date.parse(firstProduct.createdAt);
        });
    }, [categoryFilter, products, searchTerm, showSavedOnly, sortMode, wishlistItems]);

    const handleCreateCategory: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        setCategoryError('');

        const name = categoryName.trim();
        if (!name) {
            setCategoryError('Category name is required.');
            return;
        }

        void createCategory({ name })
            .then(() => setCategoryName(''))
            .catch(() => setCategoryError('Could not create category. Please try again.'));
    };

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1>Products</h1>
                    <p className="page-subtitle">{products.length} total</p>
                </div>
                <div className="shop-summaries">
                    <div className="cart-summary" aria-label="Cart summary">
                        <div>
                            <span>{itemCount} in cart</span>
                            <strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(totalPrice)}</strong>
                        </div>
                        {cartItems.length > 0 && (
                            <>
                                <ul className="cart-items">
                                    {cartItems.map((item) => (
                                        <li key={item.productId}>
                                            <span>{item.name} x{item.quantity}</span>
                                            <button
                                                className="button button-ghost"
                                                type="button"
                                                onClick={() => removeCartItem(item.productId)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button className="button button-ghost" type="button" onClick={clearCart}>
                                    Clear cart
                                </button>
                            </>
                        )}
                    </div>

                    <div className="wishlist-summary" aria-label="Wishlist summary">
                        <div>
                            <span>{wishlistItems.length} saved</span>
                            <strong>Wishlist</strong>
                        </div>
                        {wishlistItems.length > 0 && (
                            <>
                                <ul className="cart-items">
                                    {wishlistItems.map((item) => (
                                        <li key={item.productId}>
                                            <span>{item.name}</span>
                                            <button
                                                className="button button-ghost"
                                                type="button"
                                                onClick={() => removeWishlistItem(item.productId)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button className="button button-ghost" type="button" onClick={clearWishlist}>
                                    Clear wishlist
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {loading && <p className="state">Loading products...</p>}
            {error && <p className="state state-error">Could not load products: {error.message}</p>}
            {categoriesError && <p className="state state-error">Could not load categories: {categoriesError.message}</p>}
            {!loading && !error && products.length === 0 && <p className="state">No products yet.</p>}

            <div className="product-tools" aria-label="Product filters">
                <label className="saved-toggle">
                    <input
                        type="checkbox"
                        checked={showSavedOnly}
                        disabled={wishlistItems.length === 0}
                        onChange={(event) => setShowSavedOnly(event.target.checked)}
                    />
                    <span>Saved only</span>
                </label>
                <label className="form-field">
                    <span>Search</span>
                    <input
                        className="task-input"
                        type="search"
                        value={searchTerm}
                        placeholder="Search products"
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </label>
                <label className="form-field">
                    <span>Category</span>
                    <select
                        className="task-input"
                        value={categoryFilter}
                        disabled={categoriesLoading}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                    >
                        <option value="all">All categories</option>
                        <option value="uncategorized">No category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="form-field">
                    <span>Sort</span>
                    <select
                        className="task-input"
                        value={sortMode}
                        onChange={(event) => setSortMode(event.target.value)}
                    >
                        <option value="newest">Newest first</option>
                        <option value="name">Name A-Z</option>
                        <option value="price-low">Price low to high</option>
                        <option value="price-high">Price high to low</option>
                    </select>
                </label>
            </div>

            <section className="category-panel" aria-labelledby="categories-heading">
                <div>
                    <h2 id="categories-heading">Categories</h2>
                    <p>{categoriesLoading ? 'Loading categories...' : `${categories.length} available`}</p>
                </div>
                <form className="category-form" onSubmit={handleCreateCategory}>
                    <input
                        className="task-input"
                        type="text"
                        value={categoryName}
                        placeholder="New category"
                        maxLength={120}
                        onChange={(event) => setCategoryName(event.target.value)}
                    />
                    <button className="button" type="submit" disabled={isCreatingCategory}>
                        {isCreatingCategory ? 'Creating...' : 'Add category'}
                    </button>
                </form>
                {categoryError && <p className="state state-error">{categoryError}</p>}
            </section>

            <ProductForm
                disabled={isCreating}
                categories={categories}
                categoriesDisabled={categoriesLoading}
                onSubmit={createProduct}
            />
            <ul className="product-list">
                {visibleProducts.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </ul>
            {!loading && !error && products.length > 0 && visibleProducts.length === 0 && (
                <p className="state">
                    {showSavedOnly ? 'No saved products match your filters.' : 'No products match your search.'}
                </p>
            )}
        </main>
    )
}
