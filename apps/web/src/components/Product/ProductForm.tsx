import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { apolloClient } from '../../apollo/client';
import { CREATE_PRODUCT, PRODUCTS_QUERY } from '../../features/products/product-graphql';

type ProductFormState = {
  message: string;
  values: {
    name: string;
    price: string;
  };
  errors: {
    name?: string;
    price?: string;
    form?: string;
  };
};

const initialState: ProductFormState = {
  message: '',
  values: {
    name: '',
    price: '',
  },
  errors: {},
};

async function createProductAction(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const name = String(formData.get('name') ?? '').trim();
  const priceValue = String(formData.get('price') ?? '').trim();
  const price = Number(priceValue);

  const errors: ProductFormState['errors'] = {};

  if (!name) {
    errors.name = 'Name is required.';
  }

  if (!priceValue || Number.isNaN(price) || price < 0) {
    errors.price = 'Price must be 0 or more.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      message: 'Please fix the product details.',
      values: {
        name,
        price: priceValue,
      },
      errors,
    };
  }

  try {
    await apolloClient.mutate({
      mutation: CREATE_PRODUCT,
      variables: {
        input: {
          name,
          price,
        },
      },
      update(cache, result) {
        const newProduct = result.data?.createProduct;
        if (!newProduct) return;

        cache.updateQuery({ query: PRODUCTS_QUERY }, (existing) =>
          existing ? { products: [newProduct, ...existing.products] } : { products: [newProduct] },
        );
      },
    });

    return {
      message: 'Product created.',
      values: {
        name: '',
        price: '',
      },
      errors: {},
    };
  } catch (error) {
    return {
      message: '',
      values: {
        name,
        price: priceValue,
      },
      errors: {
        form: error instanceof Error ? error.message : 'Could not create product.',
      },
    };
  }
}

function ProductSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button" type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create product'}
    </button>
  );
}

export function ProductForm() {
  const [state, formAction] = useActionState(createProductAction, initialState);

  return (
    <form className="product-form" action={formAction}>
      <div className="form-field">
        <label htmlFor="product-name">Name</label>
        <input
          className="task-input"
          id="product-name"
          name="name"
          type="text"
          defaultValue={state.values.name}
          maxLength={200}
          aria-invalid={Boolean(state.errors.name)}
        />
        {state.errors.name && <p className="field-error">{state.errors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="product-price">Price</label>
        <input
          className="task-input"
          id="product-price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={state.values.price}
          aria-invalid={Boolean(state.errors.price)}
        />
        {state.errors.price && <p className="field-error">{state.errors.price}</p>}
      </div>

      {state.errors.form && <p className="state state-error">{state.errors.form}</p>}
      {state.message && !state.errors.form && <p className="state">{state.message}</p>}

      <ProductSubmitButton />
    </form>
  );
}
