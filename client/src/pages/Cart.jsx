import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../features/cart/cart.store'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, fetchCart, removeItem, loading, setBuyNowItem } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const subtotal = cart.reduce((sum, item) => {
    const price = Number(String(item.price).replace('$', '')) || 0
    const qty = Number(item.quantity) || 1
    return sum + price * qty
  }, 0)

  return (
    <div className="min-h-screen bg-[#f6f6f6] px-10 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">CART</h1>
            <p className="text-sm text-gray-600 mt-2">
              Review your items before checkout.
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <p className="text-sm font-semibold">Items ({cart.length})</p>
            <p className="text-sm text-gray-600">
              Subtotal: <span className="font-semibold text-gray-900">${subtotal.toFixed(0)}</span>
            </p>
          </div>

          <div className="px-6 py-6">
            {loading && cart.length === 0 ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : cart.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-gray-600 mb-4">Your cart is empty.</p>
                <button
                  type="button"
                  onClick={() => navigate('/collections')}
                  className="px-5 py-2 rounded-lg text-sm bg-black text-white hover:bg-gray-800 transition"
                >
                  Browse products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-5 border-b pb-6 last:border-b-0 last:pb-0">
                    <img
                      src={item.image}
                      className="w-28 h-28 object-contain bg-gray-100 rounded"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.color} / {item.size}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setBuyNowItem({
                                product_id: item.product_id,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                                color: item.color,
                                size: item.size,
                                quantity: item.quantity ?? 1,
                              })
                              navigate('/checkout')
                            }}
                            className="px-4 py-1.5 rounded-lg text-xs bg-black text-white hover:bg-gray-800 transition"
                          >
                            Shop now
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            className="text-sm text-gray-500 hover:text-red-600 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <p className="font-semibold">${Number(item.price) * (item.quantity ?? 1)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}