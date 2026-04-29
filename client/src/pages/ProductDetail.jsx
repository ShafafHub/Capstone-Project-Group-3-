import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../features/product/product.api';
import { useCartStore } from '../features/cart/cart.store';

export default function ProductDetail() {
  // --- Hooks and store ---
  const { id } = useParams();
  const navigate = useNavigate();
  const { editItem, removeItem, addItem, clearEditItem, setBuyNowItem } = useCartStore();
  
  // --- State ---
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // --- Color mapping for UI ---
  const colorMap = {
    red: '#ef4444',
    blue: '#3b82f6',
    black: '#000000',
    white: '#ffffff',
    gold: '#d4af37',
    gray: '#808080',
  };

  // --- Parse comma-separated string into array ---
  const parseList = (str) =>
    str ? str.split(',').map((item) => item.trim()) : [];

  // --- Fetch product and set initial selections ---
  useEffect(() => {
    fetchProduct(id).then((res) => {
      const data = res.data;
      setProduct(data);

      const colors = parseList(data.color);
      const sizes = parseList(data.size);

      if (editItem) {
        setSelectedColor(editItem.color);
        setSelectedSize(editItem.size);
      } else {
        setSelectedColor(colors[0]);
        setSelectedSize(sizes[0]);
      }
    });
  }, [id, editItem]);

  // --- Loading state ---
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading product...
      </div>
    );
  }

  const productColors = parseList(product.color);
  const productSizes = parseList(product.size);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start p-4 shadow-sm">

        {/* --- PRODUCT IMAGE --- */}
        <div className="flex items-center justify-center p-4 sm:p-6">
          <img
            src={product.image}
            className="w-full max-w-[380px] sm:max-w-[450px] lg:max-w-[500px] h-[300px] sm:h-[400px] lg:h-[450px] object-contain mx-auto"
          />
        </div>

        {/* --- PRODUCT DETAILS --- */}
        <div className="flex flex-col px-2 sm:px-0">

          {/* --- Product name --- */}
          <h1 className="text-3xl font-semibold mt-2">
            {product.name}
          </h1>

          {/* --- Product price --- */}
          <div className="mt-1 text-lg font-bold text-black">
            ${product.price}
          </div>

          {/* --- Tax info --- */}
          <p className="text-gray-500 mt-3 text-sm">
            MRP incl. of all taxes
          </p>

          {/* --- Description --- */}
          <p className="text-gray-900 mt-8 leading-6 text-base font-medium">
            {product.description}
          </p>

          {/* --- COLOR SELECTION --- */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Color</p>

            <div className="flex gap-3">
              {productColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-sm border ${
                    selectedColor === color ? 'ring-2 ring-black' : ''
                  }`}
                  style={{ backgroundColor: colorMap[color] }}
                />
              ))}
            </div>
          </div>

          {/* --- SIZE SELECTION --- */}
          <div className="mt-6">
            <p className="text-base text-gray-600 mb-2">Size</p>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {productSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 sm:px-4 py-2 border text-sm ${
                    selectedSize === size ? 'bg-black text-white' : 'bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              FIND YOUR SIZE | MEASUREMENT GUIDE
            </p>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* --- Add to cart button --- */}
            <button
              onClick={async () => {
                if (!selectedColor || !selectedSize) {
                  alert('Select color and size');
                  return;
                }

                if (editItem) {
                  await removeItem(editItem.id);
                }

                addItem({
                  product_id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  color: selectedColor,
                  size: selectedSize,
                });

                if (editItem) clearEditItem();
                navigate('/home');
              }}
              className="bg-gray-200 text-black py-3 uppercase tracking-[2px] hover:bg-gray-300 transition"
            >
              Add to cart
            </button>

            {/* --- Shop now (buy now) button --- */}
            <button
              onClick={async () => {
                if (!selectedColor || !selectedSize) {
                  alert('Select color and size');
                  return;
                }

                if (editItem) {
                  await removeItem(editItem.id);
                }

                // --- Buy now item (does not add to full cart) ---
                setBuyNowItem({
                  product_id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  color: selectedColor,
                  size: selectedSize,
                  quantity: 1,
                });

                if (editItem) clearEditItem();
                navigate('/checkout');
              }}
              className="bg-black text-white py-3 uppercase tracking-[2px] hover:bg-gray-800 transition"
            >
              Shop now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}