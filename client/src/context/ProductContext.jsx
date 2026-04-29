import { useEffect, useState } from "react";
import { fetchProducts } from "../features/product/product.api";
import { ProductContext } from "./product.context.js"; // Add this import

export function ProductProvider({ children }) {
  // --- State declarations ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch products on mount ---
  useEffect(() => {
    fetchProducts()
      .then(res => setProducts(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
}