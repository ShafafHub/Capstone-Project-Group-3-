import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { fetchProduct } from '../features/product/product.api'
import { useCartStore } from '../features/cart/cart.store'


export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    editItem,
    removeItem,
    addItem,
    clearEditItem,
    setBuyNowItem,
    syncCartSilent,
    cart,
  } = useCartStore()
  const [product, setProduct] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  


  const colorMap = {
    red: '#ef4444',
    blue: '#3b82f6',
    black: '#000000',
    white: '#ffffff',
    gold: '#d4af37',
    gray: '#808080',
  }

  // ✅ parse helper (clean & safe)
  const parseList = (str) =>
    str ? str.split(',').map((item) => item.trim()) : []

  useEffect(() => {
  fetchProduct(id).then((res) => {
    const data = res.data
    setProduct(data)

    const colors = parseList(data.color)
    const sizes = parseList(data.size)

    if (editItem) {
      setSelectedColor(editItem.color)
      setSelectedSize(editItem.size)
    } else {
      setSelectedColor(colors[0])
      setSelectedSize(sizes[0])
    }
  })
}, [id, editItem])

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading product...
      </div>
    )
  }

  const productColors = parseList(product.color)
  const productSizes = parseList(product.size)
  const fromParam = new URLSearchParams(location.search).get('from')
  const cameFromCheckout =
    location?.state?.from === 'checkout' || fromParam === 'checkout'

  const resolveEditRemoveId = async () => {
    if (!editItem) return null
    const fresh = (await syncCartSilent()) ?? cart
    if (!Array.isArray(fresh)) return editItem.id ?? null

    // Prefer exact cart-row id if present
    if (editItem.id != null && fresh.some((i) => i.id === editItem.id)) {
      return editItem.id
    }

    // Fallback: match by product + variant
    const match = fresh.find(
      (i) =>
        (i.product_id ?? i.id) === (editItem.product_id ?? editItem.id) &&
        (editItem.color ? i.color === editItem.color : true) &&
        (editItem.size ? i.size === editItem.size : true)
    )
    return match?.id ?? null
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start p-4 shadow-sm">

        {/* IMAGE */}
        <div className="flex items-center justify-center p-4 sm:p-6">
          <img
            src={product.image}
            className="w-full max-w-[380px] sm:max-w-[450px] lg:max-w-[500px] h-[300px] sm:h-[400px] lg:h-[450px] object-contain mx-auto"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col px-2 sm:px-0">

          <h1 className="text-3xl font-semibold mt-2">
            {product.name}
          </h1>

          <div className="mt-1 text-lg font-bold text-black">
            ${product.price}
          </div>

          <p className="text-gray-500 mt-3 text-sm">
            MRP incl. of all taxes
          </p>

          <p className="text-gray-900 mt-8 leading-6 text-base font-medium">
            {product.description}
          </p>

          {/* COLOR */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Color</p>

            <div className="flex gap-3">
              {productColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-sm border ${
                    selectedColor === color
                      ? 'ring-2 ring-black'
                      : ''
                  }`}
                  style={{ backgroundColor: colorMap[color] }}
                />
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div className="mt-6">
            <p className="text-base text-gray-600 mb-2">Size</p>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {productSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 sm:px-4 py-2 border text-sm ${
                    selectedSize === size
                      ? 'bg-black text-white'
                      : 'bg-white'
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

          {/* ACTIONS */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Add to cart → /cart */}
            <button
              onClick={async () => {
                if (!selectedColor || !selectedSize) {
                  alert('Select color and size')
                  return
                }

                if (editItem) {
                  const removeId = await resolveEditRemoveId()
                  if (removeId != null) {
                    await removeItem(removeId)
                  }
                }

                addItem({
                  product_id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  color: selectedColor,
                  size: selectedSize,
                })

                if (editItem) clearEditItem()

                navigate(cameFromCheckout ? '/checkout' : '/home')
              }}
              className="bg-gray-200 text-black py-3 uppercase tracking-[2px] hover:bg-gray-300 transition"
            >
              Add to cart
            </button>

            {/* Shop now → /checkout */}
            <button
              onClick={async () => {
                if (!selectedColor || !selectedSize) {
                  alert('Select color and size')
                  return
                }

                if (editItem) {
                  const removeId = await resolveEditRemoveId()
                  if (removeId != null) {
                    await removeItem(removeId)
                  }
                }

                // If user came from Checkout "Add more items", we should ADD (not replace).
                if (cameFromCheckout) {
                  addItem({
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    color: selectedColor,
                    size: selectedSize,
                    quantity: 1,
                  })
                } else {
                  // Buy-now should NOT add to the full cart.
                  setBuyNowItem({
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    color: selectedColor,
                    size: selectedSize,
                    quantity: 1,
                  })
                }

                if (editItem) clearEditItem()
                navigate('/checkout')
              }}
              className="bg-black text-white py-3 uppercase tracking-[2px] hover:bg-gray-800 transition"
            >
              {cameFromCheckout ? 'Add to checkout' : 'Shop now'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}