import { useProduct } from "./useProduct"

export const ProductsPage = () => {
    const { products } = useProduct();

    console.log(products);
    return (<div>
        {/* <ProductItem /> */}
    </div>)
}

