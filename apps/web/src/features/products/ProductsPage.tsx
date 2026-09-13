import { useMemo, useState, type SubmitEventHandler } from "react";

import { ProductForm } from "../../components/Product/ProductForm";
import { useCartStore } from "../../stores/cartStore";
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
    const itemCount = useCartStore((state) => state.itemCount());
    const totalPrice = useCartStore((state) => state.totalPrice());
    const [categoryName, setCategoryName] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const visibleProducts = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                categoryFilter === 'all' ||
                (categoryFilter === 'uncategorized' && !product.categoryId) ||
                product.categoryId === categoryFilter;

            if (!matchesCategory) return false;
            if (!normalizedSearch) return true;

            const categoryName = product.category?.name ?? '';
            return `${product.name} ${categoryName}`.toLowerCase().includes(normalizedSearch);
        });
    }, [categoryFilter, products, searchTerm]);

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
                <div className="cart-summary" aria-label="Cart summary">
                    <span>{itemCount} in cart</span>
                    <strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(totalPrice)}</strong>
                </div>
            </header>

            {loading && <p className="state">Loading products...</p>}
            {error && <p className="state state-error">Could not load products: {error.message}</p>}
            {categoriesError && <p className="state state-error">Could not load categories: {categoriesError.message}</p>}
            {!loading && !error && products.length === 0 && <p className="state">No products yet.</p>}

            <div className="product-tools" aria-label="Product filters">
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
                <p className="state">No products match your search.</p>
            )}
        </main>
    )
}
