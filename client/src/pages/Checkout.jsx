  import { useCartStore } from '../features/cart/cart.store'
  import { useNavigate } from 'react-router-dom'
  import { useState, useEffect } from 'react'
import previousIcon from '../assets/prev.png'
import nextIcon from '../assets/next.png'
import { getNames } from 'country-list'

const countries = getNames()

  export default function Checkout() {
    const { cart, fetchCart, setEditItem, removeItem, buyNowItem, clearBuyNowItem } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])
    const navigate = useNavigate()

    

    

    const [form, setForm] = useState({
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      country: '',
      state: '',
      address: '',
      city: '',
      postalCode: '',
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value })
    }

    // If user came here via "Shop now" from cart, they may still want to add more items.
    // Show buyNowItem together with cart items (if any).
    const orderItems = buyNowItem ? [buyNowItem, ...cart] : cart

    const subtotal = orderItems.reduce((sum, i) => {
      const price = Number(String(i.price).replace('$', '')) || 0
      const qty = Number(i.quantity) || 1
      return sum + price * qty
    }, 0)

    // ✅ VALIDATION حرفه‌ای
    const validate = () => {
  let err = {}

  // EMAIL
  if (!form.email) {
    err.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    err.email = 'Email is invalid'
  }

  // PHONE
  if (!form.phone) {
    err.phone = 'Phone is required'
  } else if (form.phone.length < 10) {
    err.phone = 'Phone is invalid'
  }

  // NAME
  if (!form.firstName) err.firstName = 'First name is required'
  if (!form.lastName) err.lastName = 'Last name is required'

  // ADDRESS
  if (!form.country) err.country = 'Country is required'
  if (!form.state) err.state = 'State is required'
  if (!form.address) err.address = 'Address is required'
  if (!form.city) err.city = 'City is required'

  if (!form.postalCode) {
    err.postalCode = 'Postal code is required'
  } else if (form.postalCode.length < 4) {
    err.postalCode = 'Postal code is invalid'
  }

  setErrors(err)
  return Object.keys(err).length === 0
}

  const handleNext = () => {
    if (!validate()) return
    navigate('/shipping')
  }


    return (
      <div className="min-h-screen bg-[#f6f6f6] px-6 py-10">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

          {/* LEFT */}
          <div>

            {/* 🔙 BACK */}
            <button
              onClick={() => navigate(-1)}
            >
              <img src={previousIcon} className="w-8 h-6 mb-8" />
            </button>

            <h1 className="text-3xl font-bold mb-6 tracking-wide">
              CHECKOUT
            </h1>

            {/* STEPPER */}
            <div className="flex gap-6 text-xs mb-8">
              <div className="flex gap-6 text-xs mb-8">
  <span className="border-b-2 border-black">
    INFORMATION
  </span>
  <span className="text-gray-400">
    SHIPPING
  </span>
  <span className="text-gray-400">
    PAYMENT
  </span>
</div>
</div>

           {/* STEP: INFO */}
<>
  <div className="mb-8">
    <h2 className="text-xs font-semibold mb-4 tracking-wide text-gray-500">
      CONTACT INFO
    </h2>

    <div className="space-y-4">

      <div>
        <input
          name="email"
          placeholder="Email"
          className={`input ${errors.email ? 'input-error' : ''}`}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div>
        <input
          name="phone"
          placeholder="Phone"
          className={`input ${errors.phone ? 'input-error' : ''}`}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}
      </div>

    </div>
  </div>

  <div>
    <h2 className="text-xs font-semibold mb-4 tracking-wide text-gray-500">
      SHIPPING ADDRESS
    </h2>

    <div className="space-y-4">

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input name="firstName" placeholder="First Name"
            className={`input ${errors.firstName ? 'input-error' : ''}`}
            onChange={handleChange}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>

        <div>
          <input name="lastName" placeholder="Last Name"
            className={`input ${errors.lastName ? 'input-error' : ''}`}
            onChange={handleChange}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
      </div>
<select
  name="country"
  className={`input ${errors.country ? 'input-error' : ''}`}
  onChange={handleChange}
  value={form.country}
>
  <option value="">Select Country</option>

  {countries.map((country) => (
    <option key={country} value={country}>
      {country}
    </option>
  ))}
</select>

{errors.country && <p className="error">{errors.country}</p>}

      <div>
        <input name="state" placeholder="State / Region"
          className={`input ${errors.state ? 'input-error' : ''}`}
          onChange={handleChange}
        />
        {errors.state && <p className="error">{errors.state}</p>}
      </div>

      <div>
        <input name="address" placeholder="Address"
          className={`input ${errors.address ? 'input-error' : ''}`}
          onChange={handleChange}
        />
        {errors.address && <p className="error">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input name="city" placeholder="City"
            className={`input ${errors.city ? 'input-error' : ''}`}
            onChange={handleChange}
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>

        <div>
          <input name="postalCode" placeholder="Postal Code"
            className={`input ${errors.postalCode ? 'input-error' : ''}`}
            onChange={handleChange}
          />
          {errors.postalCode && <p className="error">{errors.postalCode}</p>}
        </div>
      </div>

      <button onClick={handleNext} className="btn group">
        <span>Shipping</span>
        <img src={nextIcon} className="w-5 h-5 ml-auto group-hover:translate-x-1 transition" />
      </button>

    </div>
  </div>
</>

        
            

          </div>

          {/* RIGHT */}
          <div className="border p-6 h-fit">

            <h2 className="font-semibold mb-6 text-sm">
              YOUR ORDER ({orderItems.length})
            </h2>
            <button
          onClick={() => navigate('/collections?from=checkout')}
          className="text-base mb-5"
        >
          Add more items
        </button>
<div className="overflow-y-auto pr-2">

 {orderItems.map((item, idx) => (
              
            <div
              key={
                item?.id ??
                `${item?.product_id ?? item?.name ?? "item"}-${item?.color ?? ""}-${item?.size ?? ""}-${idx}`
              }
              className="flex gap-4 mb-6 items-start"
            >

    {/* IMAGE */}
    <img
      src={item.image}
      alt={item.name || "Product"}
      className="w-40 h-40 object-contain"
    />

    {/* INFO + BUTTONS */}
     <div className="flex flex-col gap-2 flex-1">

      <p className="text-base font-medium">
        {item.name}
      </p>

      <p className="text-sm text-gray-500">
        {item.color} / {item.size}
      </p>

      {/* PRICE اگر داری */}
      <p className="text-base font-medium">
        ${item.price}
      </p>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2 mt-2 items-start">

        <button
          onClick={() => {
  setEditItem(item)
  // If we were in buy-now mode, allow editing by clearing it.
  if (buyNowItem && (buyNowItem.id ?? buyNowItem.product_id) === (item.id ?? item.product_id)) {
    clearBuyNowItem()
  }
  // Navigate directly to the product details page so the user can re-pick color/size.
  navigate(`/products/${item.product_id ?? item.id}`)
}}
          className="text-sm"
        >
          Change
        </button>

        

        <button
          onClick={() => {
            removeItem(item)
          }}
          className="text-sm text-red-500"
        >
          Remove
        </button>

      </div>

    </div>

  </div>
            ))}

</div>
               
            

            {/* TOTAL */}
            <div className="border-t pt-4 text-sm mt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>

              <div className="flex justify-between font-semibold text-lg mt-4">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

        {/* styles */}
        <style>{`
          .input {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 10px;
            background: #F2F2F2;
          }
          .btn {
            width: 100%;
            background: #e5e5e5;
            padding: 12px;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
          }
          .error {
            color: red;
            font-size: 12px;
            margin-bottom: 5px;
            margin-left: 7px;
          }
        `}</style>

      </div>
    )
  }