import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../features/product/product.api';
import { useCartStore } from '../features/cart/cart.store';


export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProduct(id).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <button
        onClick={() =>
        addItem({
        productId: product.id,
        quantity: 1,
        })
      }
    >
    Add to Cart
    </button>
  </div>
  );
}