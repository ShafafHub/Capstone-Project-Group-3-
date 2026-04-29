// --- Imports ---
import { useCartStore } from '../features/cart/cart.store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// --- Assets ---
import paypalIcon from '../assets/paypal.png';
import cardIcon from '../assets/card.png';
import cashIcon from '../assets/cash.png';
import check from '../assets/check.png';
import previousIcon from '../assets/prev.png';

// --- PaymentOption component ---
function PaymentOption({ id, label, icon, method, setMethod }) {
  return (
    <label
      className={`flex items-center gap-4 border p-4 cursor-pointer transition 
      ${method === id ? ' bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
    >
      <input
        type="radio"
        name="payment"
        checked={method === id}
        onChange={() => setMethod(id)}
      />

      <img src={icon} className="w-20 h-18" />

      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

// --- Main Payment component ---
export default function Payment() {
  // --- Store and navigation ---
  const { cart, clearCartServer, buyNowItem, clearBuyNowItem } = useCartStore();
  const navigate = useNavigate();

  // --- Card form state ---
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  // --- Card validation errors ---
  const [errors, setErrors] = useState({});

  // --- Valid algorithm for card number ---
  const isValidCardNumber = (num) => {
    let arr = (num + '')
      .replace(/\D/g, '')
      .split('')
      .reverse()
      .map(x => parseInt(x));

    let sum = arr.reduce((acc, val, i) => {
      if (i % 2 !== 0) {
        val *= 2;
        if (val > 9) val -= 9;
      }
      return acc + val;
    }, 0);

    return sum % 10 === 0;
  };

  // --- Validate card inputs ---
  const validateCard = () => {
    const newErrors = {};

    const number = card.number.replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(number)) {
      newErrors.number = 'Card number must be 13 to 19 digits';
    } else if (!isValidCardNumber(number)) {
      newErrors.number = 'Invalid card number';
    }

    if (card.name.trim().length < 3) {
      newErrors.name = 'Name is too short';
    }

    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      newErrors.expiry = 'Format must be MM/YY';
    }

    if (!/^\d{3,4}$/.test(card.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handle payment submission ---
  const handlePayment = async () => {
    if (method === 'card') {
      const isValid = validateCard();
      if (!isValid) return;
    }

    alert('Payment successful');

    if (buyNowItem) {
      clearBuyNowItem();
    } else {
      await clearCartServer();
    }
    navigate('/home');
  };

  // --- Payment method state ---
  const [method, setMethod] = useState('card');

  // --- Determine items to show (buy now or cart) ---
  const orderItems = buyNowItem ? [buyNowItem] : cart;

  // --- Calculate totals ---
  const subtotal = orderItems.reduce((sum, item) => {
    const price = Number(String(item.price).replace('$', '')) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  const shipping = 10;
  const total = subtotal + shipping;

  // --- JSX return ---
  return (
    <div className="min-h-screen bg-[#f6f6f6] px-10 py-10">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

        {/* --- LEFT COLUMN (Payment form) --- */}
        <div className="col-span-1 lg:col-span-2">

          {/* --- Back button --- */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 text-sm text-gray-600"
          >
            <img src={previousIcon} className="w-8 h-6 mb-8" />
          </button>

          {/* --- Page title --- */}
          <h1 className="text-3xl font-bold mb-6 tracking-wide">
            CHECKOUT
          </h1>

          {/* --- Stepper indicator --- */}
          <div className="flex flex-wrap gap-6 lg:gap-8 text-xs mb-10">
            <span className="text-gray-400">INFORMATION</span>
            <span className="text-gray-400">SHIPPING</span>
            <span className="border-b-2 border-black pb-1 font-semibold">
              PAYMENT
            </span>
          </div>

          {/* --- Payment method section --- */}
          <h2 className="text-sm font-semibold mb-4">
            Payment Method
          </h2>

          <div className="space-y-3">
            <PaymentOption
              id="card"
              label="Credit / Debit Card"
              icon={cardIcon}
              method={method}
              setMethod={setMethod}
            />

            <PaymentOption
              id="cash"
              label="Cash on Delivery"
              icon={cashIcon}
              method={method}
              setMethod={setMethod}
            />

            <PaymentOption
              id="paypal"
              label="PayPal"
              icon={paypalIcon}
              method={method}
              setMethod={setMethod}
            />
          </div>

          {/* --- Card form (conditional) --- */}
          {method === 'card' && (
            <div className="mt-8 bg-white border p-5 sm:p-6 grid grid-cols-1 gap-3">
              <input
                placeholder="Card Number"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                className="border p-3 text-sm col-span-2 w-full"
              />
              {errors.number && <p className="text-red-500 text-xs col-span-2">{errors.number}</p>}

              <input
                placeholder="Name on Card"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                className="border p-3 text-sm col-span-2 w-full"
              />
              {errors.name && <p className="text-red-500 text-xs col-span-2">{errors.name}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    className="border p-3 text-sm w-full"
                  />
                  {errors.expiry && <p className="text-red-500 text-xs">{errors.expiry}</p>}
                </div>

                <div>
                  <input
                    placeholder="CVV"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="border p-3 text-sm w-full"
                  />
                  {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}

          {/* --- Cash on delivery info (conditional) --- */}
          {method === 'cash' && (
            <div className="mt-8 bg-white border p-5 sm:p-6 space-y-3">
              <p className="text-sm text-gray-600">
                You will pay when your order is delivered.
              </p>

              <div className="text-sm space-y-2">
                <p className="flex items-center gap-2">
                  <img src={check} alt="check" className="w-5 h-5" />
                  No online payment required
                </p>

                <p className="flex items-center gap-2">
                  <img src={check} alt="check" className="w-5 h-5" />
                  Pay in cash to courier
                </p>
              </div>
            </div>
          )}

          {/* --- PayPal option (conditional) --- */}
          {method === 'paypal' && (
            <div className="mt-8 bg-white border p-5 sm:p-6 text-center space-y-4">
              <p className="text-sm text-gray-600">
                You will be redirected to PayPal to complete your payment.
              </p>

              <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 text-sm font-medium">
                <a href="https://www.paypal.com">Continue with PayPal</a>
              </button>
            </div>
          )}

        </div>

        {/* --- RIGHT COLUMN (Order summary) --- */}
        <div className="col-span-1 mt-10 lg:mt-0">

          <div className="bg-white border p-5 sm:p-6 lg:p-6 sticky top-10 w-full">

            <h2 className="text-sm font-semibold mb-6">
              ORDER SUMMARY
            </h2>

            <div className="text-sm space-y-3 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>${subtotal.toFixed(0)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>${shipping}</span>
              </div>
            </div>

            <div className="flex justify-between font-semibold mt-4 mb-6">
              <span>Total</span>
              <span>${total.toFixed(0)}</span>
            </div>

            {/* --- Pay button --- */}
            <button
              onClick={handlePayment}
              className="w-full bg-gray-800 text-white py-3 text-sm hover:bg-gray-900 mt-2"
            >
              PAY NOW
            </button>

            <p className="text-[11px] text-gray-400 mt-4 text-center">
              Secure payment processing
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}