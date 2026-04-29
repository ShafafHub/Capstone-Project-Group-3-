import { useEffect, useState } from "react"
import { fetchProducts } from "../features/product/product.api"
import { Link } from "react-router-dom"

export default function Kids() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts().then(res => {
      const kidsProducts = res.data.filter(p => p.category === "kids")
      setProducts(kidsProducts)
    })
  }, [])

  return (
    <div className="p-10">

      <h1 className="text-2xl mb-6">KIDS COLLECTION</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        {products.map(p => (
          <Link to={`/products/${p.id}`} key={p.id}>

            <div>
              <img src={p.image} className="w-full h-[300px] object-contain bg-gray-100" />
              <h3>{p.name}</h3>
              <p className="font-semibold">{p.description}</p>
              <p className="text-sm text-gray-500">${p.price}</p>
            </div>

          </Link>
        ))}

      </div>

    </div>
  )
}