import { useCartStore } from '../features/cart/cart.store';
import { useNavigate } from 'react-router-dom';
import plus from '../assets/add.png';
import minus from '../assets/minus.png';
import close from '../assets/close.png';
import reset from '../assets/circular.png';
import previousIcon from '../assets/prev.png';
import { useState } from 'react';

export default function Shipping() {
  // --- Store and navigation ---
  const { cart, updateQuantity, resetQuantity, removeItemLocal, buyNowItem } = useCartStore();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // --- Determine items (buy now or cart) ---
  const orderItems = buyNowItem ? [buyNowItem] : cart;

  // --- Calculate subtotal ---
  const subtotal = orderItems.reduce((sum, item) => {
    const price = Number(String(item.price).replace('$', '')) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-[#f6f6f6] px-10 py-8">
      {/* --- MAIN CONTAINER --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        
        {/* --- LEFT COLUMN (Items) --- */}
        <div className="col-span-1 lg:col-span-2">
          
          {/* --- Back button --- */}
          <button onClick={() => navigate(-1)}>
            <img src={previousIcon} className="w-8 h-6 mb-10" />
          </button>

          {/* --- Page title --- */}
          <h1 className="text-3xl font-bold mb-8 tracking-wide">CHECKOUT</h1>

          {/* --- Stepper indicator --- */}
          <div className="flex gap-8 text-xs mb-10 tracking-wide">
            <span className="text-gray-400">INFORMATION</span>
            <span className="border-b-2 border-black pb-1">SHIPPING</span>
            <span className="text-gray-400">PAYMENT</span>
          </div>

          {/* --- Shopping bag title --- */}
          <h2 className="text-sm mb-6 font-semibold">Shopping Bag</h2>

          {/* --- Items grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {orderItems.map((item, idx) => (
              <div
                key={
                  item?.id ??
                  `${item?.product_id ?? item?.name ?? "item"}-${item?.color ?? ""}-${item?.size ?? ""}-${idx}`
                }
                className="flex flex-col sm:flex-row gap-4 sm:gap-6"
              >
                {/* --- LEFT - Image and text --- */}
                <div className="w-full sm:w-[260px] flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name || "Product"}
                    className="w-full h-[220px] sm:h-[300px] object-contain bg-gray-100"
                  />

                  {/* --- Text under image --- */}
                  <div className="mt-3 text-sm space-y-1">
                    <div className="flex justify-between items-center mt-1">
                      <p className="font-semibold">{item.name}</p>
                      <span>${item.price}</span>
                    </div>
                  </div>
                </div>

                {/* --- RIGHT - Controls (close, size, color, quantity, reset) --- */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-5 text-sm pt-2">
                  
                  {/* --- Close/Remove button --- */}
                  <button
                    onClick={() => {
                      if (buyNowItem) return;
                      removeItemLocal(item.id);
                    }}
                  >
                    <img src={close} alt="close" className="w-5 h-5" />
                  </button>

                  {/* --- Size display --- */}
                  <div>
                    <p className="text-base font-semibold text-gray-600 ml-1.5">
                      {item.size}
                    </p>
                  </div>

                  {/* --- Color swatch --- */}
                  <div
                    className="w-8 h-8 mt-1 border"
                    style={{ backgroundColor: item.color }}
                  ></div>

                  {/* --- Quantity controls --- */}
                  <div>
                    <div className="border flex flex-row sm:flex-col items-center w-20 sm:w-8 text-sm">
                      {/* --- Plus button --- */}
                      <button
                        onClick={() => {
                          updateQuantity(item.id ?? item.product_id, (item.quantity ?? 1) + 1);
                        }}
                      >
                        <img src={plus} alt="plus" className="w-5 h-5" />
                      </button>

                      {/* --- Quantity value --- */}
                      <span className="w-full h-8 flex items-center justify-center border-y">
                        {item.quantity ?? 1}
                      </span>

                      {/* --- Minus button --- */}
                      <button
                        onClick={() => {
                          updateQuantity(
                            item.id ?? item.product_id,
                            Math.max(1, (item.quantity ?? 1) - 1)
                          );
                        }}
                        disabled={(item.quantity ?? 1) <= 1}
                      >
                        <img src={minus} alt="minus" className="w-5 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* --- Reset button --- */}
                  <button
                    onClick={() => {
                      resetQuantity(item.id ?? item.product_id);
                    }}
                    className="text-gray-500 text-lg hover:text-black ml-2"
                  >
                    <img src={reset} alt="reset" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN (Order Summary) --- */}
        <div className="col-span-1 mt-10 lg:mt-20 lg:mr-10">
          <div className="border p-5 sm:p-6 self-start w-full">
            <h2 className="text-sm tracking-wide mb-6">ORDER SUMMARY</h2>

            {/* --- Totals --- */}
            <div className="border-t pt-4 text-sm">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(0)}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span>$10</span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>TOTAL (TAX INCL.)</span>
                <span>${(subtotal + 10).toFixed(0)}</span>
              </div>

              {/* --- Terms and conditions checkbox --- */}
              <div className="flex items-center gap-2 mt-6 text-xs">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>I agree to the Terms and Conditions</span>
              </div>

              {/* --- Continue button (enabled only if terms accepted) --- */}
              <button
                onClick={() => navigate('/payment')}
                disabled={!acceptedTerms}
                className={`w-full mt-4 py-3 text-sm transition
                  ${
                    acceptedTerms
                      ? 'bg-gray-200 hover:bg-gray-300 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}