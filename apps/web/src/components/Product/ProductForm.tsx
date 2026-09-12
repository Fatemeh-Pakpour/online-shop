import { useState, type SubmitEventHandler } from 'react';

import type { Category, CreateProductInput } from '../../features/products/product-graphql';

interface ProductFormProps {
  disabled: boolean;
  categories: Category[];
  categoriesDisabled?: boolean;
  onSubmit: (input: CreateProductInput) => Promise<unknown>;
}

export const ProductForm = ({ disabled, categories, categoriesDisabled = false, onSubmit }: ProductFormProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setFormError('');

    const trimmedName = name.trim();
    const parsedPrice = Number(price);

    if (!trimmedName) {
      setFormError('Name is required.');
      return;
    }

    if (!price || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('Price must be 0 or more.');
      return;
    }

    const input: CreateProductInput = {
      name: trimmedName,
      price: parsedPrice,
    };

    if (categoryId) {
      input.categoryId = categoryId;
    }

    void onSubmit(input)
      .then(() => {
        setName('');
        setPrice('');
        setCategoryId('');
      })
      .catch(() => {
        setFormError('Could not create product. Please try again.');
      });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="product-name">Name</label>
        <input
          className="task-input"
          id="product-name"
          name="name"
          type="text"
          value={name}
          maxLength={200}
          onChange={(event) => setName(event.target.value)}
        // aria-invalid={Boolean(state.errors.name)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="product-price">Price</label>
        <input
          className="task-input"
          id="product-price"
          name="price"
          type="number"
          value={price}
          min="0"
          step="0.01"
          onChange={(event) => setPrice(event.target.value)}
        // aria-invalid={Boolean(state.errors.price)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="product-category">Category</label>
        <select
          className="task-input"
          id="product-category"
          name="categoryId"
          value={categoryId}
          disabled={categoriesDisabled}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {formError && <p className="state state-error">{formError}</p>}

      <button className="button" type="submit" disabled={disabled}>
        {disabled ? 'Creating...' : 'Create product'}
      </button>
    </form>
  );
}
