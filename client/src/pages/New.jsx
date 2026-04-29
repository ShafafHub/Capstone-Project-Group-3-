import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function New() {
  // --- State declarations ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch and filter new products on mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products');
        const newOnly = res.data.filter(
          p => p.is_new === true || p.is_new === 1
        );
        setProducts(newOnly);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Loading state ---
  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      
      {/* --- Page title --- */}
      <h1 className="text-2xl font-semibold mb-8 tracking-[2px]">
        NEW
        COLLECTION
        2026
      </h1>

      {/* --- Products grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {products.map((item) => (
          <div key={item.id} className="p-3">

            {/* --- Product image --- */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[200px] object-contain mb-3"
            />

            {/* --- Product details --- */}
            <h3 className="text-sm font-medium">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.description}</p>
            <p className="text-sm mt-2 font-semibold">{item.price}$</p>

          </div>
        ))}

      </div>

    </div>
  );
}