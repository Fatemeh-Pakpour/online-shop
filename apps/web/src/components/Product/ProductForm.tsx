import { useState, type SubmitEventHandler } from 'react';
import { useMutation } from '@apollo/client/react';

import { CREATE_PRODUCT, PRODUCTS_QUERY } from '../../features/products/product-graphql';


export const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState('');

  const [createProduct, { loading: isCreating }] = useMutation(CREATE_PRODUCT, {
    update(cache, result) {
      const newProduct = result.data?.createProduct;
      if (!newProduct) return;

      cache.updateQuery({ query: PRODUCTS_QUERY }, (existing) =>
        existing ? { products: [newProduct, ...existing.products] } : { products: [newProduct] },
      );
    },
  });

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

    void createProduct({
      variables: {
        input: {
          name: trimmedName,
          price: parsedPrice,
        },
      },
    })
      .then(() => {
        setName('');
        setPrice('');
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

      {formError && <p className="state state-error">{formError}</p>}

      <button className="button" type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create product'}
      </button>
    </form>
  );
}
