import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import heart from '../assets/heart.png';
import { useAuth } from '../context/useAuth';

export default function Favorites() {
  // --- State declarations ---
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth(); // Will be taken from Auth later
  const isMounted = useRef(true); // Prevents setState after unmount

  // --- Load favorites from backend ---
  const loadFavorites = useCallback(async () => {
    try {
      const favRes = await fetch(`http://localhost:3000/api/favorites/${userId}`);
      const favData = await favRes.json();
      const favoriteIds = favData.favorites || [];

      if (favoriteIds.length === 0) {
        if (isMounted.current) {
          setFavoriteProducts([]);
          setLoading(false);
        }
        return;
      }

      const productsRes = await fetch('http://localhost:3000/api/products');
      const allProducts = await productsRes.json();
      const filtered = allProducts.filter(p => favoriteIds.includes(p.id));
      
      if (isMounted.current) {
        setFavoriteProducts(filtered);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      if (isMounted.current) setLoading(false);
    }
  }, [userId]);

  // --- Initial load effect ---
  useEffect(() => {
    isMounted.current = true;
    // Defer to avoid setState-in-effect lint rule
    setTimeout(() => {
      loadFavorites();
    }, 0);
    
    return () => {
      isMounted.current = false;
    };
  }, [loadFavorites]);

  // --- Remove favorite product ---
  const removeFavorite = async (productId) => {
    try {
      await fetch('http://localhost:3000/api/favorites/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: productId })
      });
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- Loading state ---
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      
      {/* --- Header --- */}
      <h1 className="text-3xl font-light mb-6">My Favorites</h1>
      <p className="text-gray-500 mb-10">{favoriteProducts.length} items saved</p>

      {/* --- Empty state or product grid --- */}
      {favoriteProducts.length === 0 ? (
        // --- Empty favorites state ---
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🤍</div>
          <h2 className="text-2xl font-light mb-2">No favorites yet</h2>
          <Link to="/products" className="inline-block px-8 py-3 bg-black text-white">
            BROWSE PRODUCTS
          </Link>
        </div>
      ) : (
        // --- Favorites product grid ---
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="relative group">
              <Link to={`/products/${product.id}`}>
                {/* --- Product image --- */}
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full aspect-[4/5] object-cover mb-3 bg-gray-100" 
                />
                {/* --- Product details --- */}
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
                <p className="font-medium mt-2">${product.price}</p>
              </Link>
              
              {/* --- Remove favorite button (heart) --- */}
              <button
                onClick={() => removeFavorite(product.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
              >
                <img 
                  src={heart} 
                  alt="remove" 
                  className="w-4 h-4"
                  style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(5000%) hue-rotate(340deg)' }}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}