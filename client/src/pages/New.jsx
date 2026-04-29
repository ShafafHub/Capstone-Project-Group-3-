import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Link } from 'react-router-dom'

export default function New() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products')
        const newOnly = res.data.filter(
          p => p.is_new === true || p.is_new === 1
        )
        setProducts(newOnly)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      
      <h1 className="text-2xl font-semibold mb-8 tracking-[2px]">
        NEW
        COLLECTION
        2026
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {products.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.id}`}
            className="p-3 cursor-pointer block"
          >

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[200px] object-contain mb-3"
            />

            <h3 className="text-sm font-medium">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.description}</p>
            <p className="text-sm mt-2 font-semibold">{item.price}$</p>

          </Link>
        ))}

      </div>

    </div>
  )
}