import { useEffect, useState } from 'react';
import { fetchProducts } from '../features/product/product.api';
import { Link } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // --- search filter ---
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">

        <h1 className="text-3xl font-bold mb-4">
          Products
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black"
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No products found
          </p>
        ) : (
          filteredProducts.map((p) => (
            <Link
              to={`/products/${p.id}`}
              key={p.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >

              {/* Image placeholder */}
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  No Image
                </span>
              </div>

              {/* Content */}
              <div className="p-4">

                <h3 className="font-semibold text-lg mb-1">
                  {p.name}
                </h3>

                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {p.description}
                </p>

                <div className="flex items-center justify-between">

                  <span className="font-bold text-black">
                    ${p.price}
                  </span>

                  <span className="text-xs text-gray-400">
                    View →
                  </span>

                </div>

              </div>

            </Link>
          ))
        )}

      </div>

    </div>
  );
}