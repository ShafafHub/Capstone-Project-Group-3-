import { useEffect, useState } from 'react'
import { fetchProducts } from '../features/product/product.api'
import { Link, useLocation } from 'react-router-dom'
import searchIcon from '../assets/magnifying-glass.png'
import rightIcon from '../assets/arrow right.png'
import upIcon from '../assets/arrow up.png'
import goldStar from '../assets/star (1).png'
import Star from '../assets/star.png'
import heart from '../assets/heart.png'

export default function Products() {
  const location = useLocation()
  const fromParam = new URLSearchParams(location.search).get('from')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]) // اضافه شد
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState('')
  const [availability, setAvailability] = useState('')
  const [rating, setRating] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(999999)
  const [collections, setCollections] = useState('')
  const [color, setColor] = useState('')
  const [tags, setTags] = useState([])
  const [activeTab, setActiveTab] = useState('')
  const [openSize, setOpenSize] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)
  const [openPrice, setOpenPrice] = useState(false)
  const [openAvailability, setOpenAvailability] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openCollection, setOpenCollection] = useState(false)
  const [openRating, setOpenRating] = useState(false)
  const [openTags, setOpenTags] = useState(false)
  const [favorites, setFavorites] = useState([])

  const userId = 1;

  // بارگذاری favorites از backend
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/favorites/${userId}`);
        const data = await res.json();
        if (data.success) {
          setFavorites(data.favorites);
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };
    
    loadFavorites();
  }, [userId]);

  // بارگذاری categories از backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/categories');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // تابع اضافه/حذف به backend
  const toggleFavorite = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorite = favorites.includes(productId);
    
    try {
      if (isFavorite) {
        await fetch('http://localhost:3000/api/favorites/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, product_id: productId })
        });
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        await fetch('http://localhost:3000/api/favorites/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, product_id: productId })
        });
        setFavorites(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetchProducts()
      setProducts(res.data)
      setLoading(false)
    }
    load()
  }, [])


  const inStockCount = products.filter(p => p.in_stock).length
const outStockCount = products.filter(p => !p.in_stock).length

  const normalizeToken = (v) => String(v ?? '').trim().toLowerCase()
  const splitTokens = (v) =>
    String(v ?? '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)

  const normalizeSize = (v) => String(v ?? '').trim().toUpperCase()
  const sizeAliases = (picked) => {
    const s = normalizeSize(picked)
    if (!s) return []
    if (s === '2X' || s === '2XL' || s === 'XXL') return ['2X', '2XL', 'XXL']
    return [s]
  }

const filtered = products.filter((p) => {
  const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())

  const matchCategory =
    selectedCategory === 'all' || p.category === selectedCategory

    const matchPrice =
    p.price >= minPrice && p.price <= maxPrice

  const matchSize =
    !size ||
    splitTokens(p.size)
      .map((x) => normalizeSize(x))
      .some((x) => sizeAliases(size).includes(x))

    const matchCollections =
  !collections ||
  (collections === 'NEW COLLECTION' && p.is_new) ||
  (collections === 'XIV COLLECTION' && !p.is_new)

  const matchColor =
  !color ||
  splitTokens(p.color)
    .map((c) => normalizeToken(c))
    .includes(normalizeToken(color))

  const matchAvailability =
  !availability ||
  (availability === 'in' && p.in_stock) ||
  (availability === 'out' && !p.in_stock)

  const matchTags =
  tags.length === 0 ||
  tags.some(tag =>
    p.tags
      ?.split(',')
      .map(t => t.trim())
      .includes(tag)
  )

  const matchTab =
  !activeTab ||
  (activeTab === 'NEW' && p.is_new) ||
  (activeTab === 'BEST SELLERS' && p.tags?.includes('best-seller')) ||
  (activeTab === 'SHIRTS' && p.tags?.includes('shirt')) ||
  (activeTab === 'T-SHIRTS' && p.tags?.includes('t-shirt')) ||
  (activeTab === 'POLO SHIRTS' && p.tags?.includes('polo-shirt')) ||
  (activeTab === 'JEANS' && p.tags?.includes('jeans')) ||
  (activeTab === 'SHORTS' && p.tags?.includes('short')) ||
  (activeTab === 'JACKETS' && p.tags?.includes('jacket')) ||
  (activeTab === 'SUIT' && p.tags?.includes('suit')) ||
  (activeTab === 'COAT' && p.tags?.includes('coat'))

  const matchRating =
  !rating || p.rating >= rating

  return matchSearch
   && matchSize
    && matchCategory
     && matchPrice
      && matchCollections
       && matchColor
       && matchAvailability
       && matchTab
       && matchTags
        && matchRating
})

  

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>
  }
  return (
  <div className="bg-[#f7f7f7] min-h-screen px-6 py-8">

    <div className="max-w-7xl mx-auto">

      

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

        {/* SIDEBAR */}
        <div className="w-full md:w-64 lg:w-72 shrink-0 text-sm">

          <h3 className="text-xl font-bold mb-4 mt-20">Filters</h3>

      {/* Size */}
<div className="border-t py-3 text-sm">
  <div
    onClick={() => setOpenSize(!openSize)}
    className="flex justify-between items-center cursor-pointer"
  >
    <span className="font-medium">Size</span>
    <span>
      {openSize ? (
        <img src={upIcon} className="w-6 h-6" />
      ) : (
        <img src={rightIcon} className="w-6 h-6" />
      )}
    </span>
  </div>

  {openSize && (
    <div className="flex flex-wrap gap-2 mt-2">
      {['XS','S','M','L','XL','2X'].map((s) => (
        <button
          key={s}
          onClick={() => setSize(size === s ? '' : s)}
          className={`border px-3 py-1 text-sm ${
            size === s ? 'bg-black text-white' : ''
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )}
</div>

{/* AVAILABILITY */}
<div className="border-t py-3 text-sm">

  <div
    onClick={() => setOpenAvailability(!openAvailability)}
    className="flex justify-between items-center cursor-pointer"
  >
    <span className="font-medium">Availability</span>

    <span>
      {openAvailability ? (
        <img src={upIcon} className="w-6 h-6" />
      ) : (
        <img src={rightIcon} className="w-6 h-6" />
      )}
    </span>
  </div>

  {openAvailability && (
    <div className="mt-2 flex flex-col gap-2">

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="radio"
          name="availability"
          checked={availability === 'in'}
          onChange={() => setAvailability('in')}
        />
        In stock ({inStockCount})
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="radio"
          name="availability"
          checked={availability === 'out'}
          onChange={() => setAvailability('out')}
        />
        Out of stock ({outStockCount})
      </label>

      <button
        onClick={() => setAvailability('')}
         className="text-xs mt-2 px-3 py-1 border rounded-md hover:bg-gray-600 hover:text-white transition"
      >
        Show all
      </button>

    </div>
  )}
</div>



  {/* Category - اصلاح شد */}
<div className="border-t py-3 text-sm">
  <div
    onClick={() => setOpenCategory(!openCategory)}
    className="flex justify-between items-center cursor-pointer"
  >
    <span className="font-medium">Category</span>
    <span>
      {openCategory ? (
        <img src={upIcon} className="w-6 h-6" />
      ) : (
        <img src={rightIcon} className="w-6 h-6" />
      )}
    </span>
  </div>

  {openCategory && (
    <div className="mt-2 flex flex-col gap-2">
      {/* گزینه "all" برای نمایش همه */}
      <div
        onClick={() => setSelectedCategory('all')}
        className={`cursor-pointer text-sm font-medium ${
          selectedCategory === 'all' ? 'text-black font-bold' : 'text-gray-600'
        }`}
      >
        ALL
      </div>
      
      {/* لیست category ها از backend */}
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => setSelectedCategory(cat.name)}
          className={`cursor-pointer text-sm font-medium ${
            selectedCategory === cat.name ? 'text-black font-bold' : 'text-gray-600'
          }`}
        >
          {cat.name.toUpperCase()}
        </div>
      ))}
    </div>
  )}
</div>


{/* COLORS */}
<div className="border-t py-3 text-sm">
  <div
    onClick={() => setOpenColor(!openColor)}
    className="flex justify-between items-center cursor-pointer"
  >
    <span className="font-medium">Colors</span>

    <span>
      {openColor ? (
        <img src={upIcon} className="w-6 h-6" />
      ) : (
        <img src={rightIcon} className="w-6 h-6" />
      )}
    </span>
  </div>

  {openColor && (
    <div className="mt-3 flex gap-3">
      {[
        { name: 'black', class: 'bg-black' },
        { name: 'white', class: 'bg-white border' },
        { name: 'red', class: 'bg-red-500' },
        { name: 'blue', class: 'bg-blue-500' },
        { name: 'gold', class: 'bg-yellow-300' },
      ].map((c) => (
        <div
          key={c.name}
          onClick={() => setColor(color === c.name ? '' : c.name)}
          className={`w-6 h-6 rounded-full cursor-pointer ${c.class} ${
            color === c.name ? 'ring-2 ring-black' : ''
          }`}
        />
      ))}
    </div>
  )}
</div>


{/* PRICE*/}
<div className="border-t py-3 text-sm">
  <div
    onClick={() => setOpenPrice(!openPrice)}
    className="flex justify-between items-center cursor-pointer"
  >
    <span className="font-medium">Price Range</span>

    <span>
      {openPrice ? (
        <img src={upIcon} className="w-5 h-5" />
      ) : (
        <img src={rightIcon} className="w-5 h-5" />
      )}
    </span>
  </div>

  {openPrice && (
    <div className="mt-3 space-y-2">
      <input
        type="number"
        placeholder="Min"
        onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
        className="border p-2 w-full text-sm"
      />

      <input
        type="number"
        placeholder="Max"
        onChange={(e) => setMaxPrice(Number(e.target.value) || 999999)}
        className="border p-2 w-full text-sm"
      />
    </div>
  )}
</div>

{/* collection */}
<div className="border-t py-3 text-sm">
  <div
    onClick={() => setOpenCollection(!openCollection)}
    className="flex justify-between items-center cursor-pointer"
  >
    <span className="font-medium">Collections</span>

    <span>
      {openCollection ? (
        <img src={upIcon} className="w-6 h-6" />
      ) : (
        <img src={rightIcon} className="w-6 h-6" />
      )}
    </span>
  </div>

  {openCollection && (
    <div className="mt-2 flex flex-col gap-2">
      {['NEW COLLECTION', 'XIV COLLECTION'].map((c) => (
        <span
          key={c}
          onClick={() =>
            setCollections(collections === c ? '' : c)
          }
          className={`text-sm cursor-pointer px-2 py-1 transition ${
            collections === c
              ? 'bg-gray-700 text-white'
              : 'hover:bg-gray-600 hover:text-white'
          }`}
        >
          {c}
        </span>
      ))}
    </div>
  )}
</div>


      {/* TAGS */}
<div className="border-t py-3 text-sm">

  <div
    onClick={() => setOpenTags(!openTags)}
    className="flex justify-between items-center cursor-pointer"
  >
    <span className="font-medium">Tags</span>

    <span>
      {openTags ? (
        <img src={upIcon} className="w-6 h-6" />
      ) : (
        <img src={rightIcon} className="w-6 h-6" />
      )}
    </span>
  </div>

  {openTags && (
    <div className="mt-2 flex flex-col gap-2">

      {[
        't-shirt',
        'shirt',
        'jeans',
        'best-seller',
        'new',
        'short',
        'jacket',
        'suit',
        'polo-shirt',
        'coat'
      ].map((t) => (
        <label key={t} className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={tags.includes(t)}
            onChange={() => {
              setTags((prev) =>
                prev.includes(t)
                  ? prev.filter((x) => x !== t)
                  : [...prev, t]
              )
            }}
          />
          {t}
        </label>
      ))}

    </div>
  )}
</div>

 {/* RATING */}
<div className="border-t py-3 text-sm">

  <div
    onClick={() => setOpenRating(!openRating)}
    className="flex justify-between items-center cursor-pointer"
  >
    <span className="font-medium">Rating</span>

    <span>
      {openRating ? (
        <img src={upIcon} className="w-6 h-6" />
      ) : (
        <img src={rightIcon} className="w-6 h-6" />
      )}
    </span>
  </div>

  {openRating && (
    <div className="flex gap-2 mt-3">

  {[1,2,3,4,5].map((star) => (
    <img
      key={star}
      src={star <= rating ? goldStar : Star}
      alt="star"
      className="w-5 h-5 cursor-pointer transition"
      onClick={() =>
        setRating(rating === star ? 0 : star)
      }
    />
  ))}

</div>
  )}
</div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
        
        <h1 className="text-2xl font-bold mt-2">PRODUCTS</h1>
      </div>

          {/* SEARCH + TABS */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            {/* HEADER */}
      
            {/* SEARCH */}
            <div className="flex items-center bg-gray-200 px-4 py-2 rounded w-full lg:w-80">
              <img src={searchIcon} className="w-5 h-5" />
              <input
              type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-right"
              />
  
            </div>
           {/* TABS */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs w-full">
  {[
    'NEW',
    'BEST SELLERS',
    'SHIRTS',
    'T-SHIRTS',
    'POLO SHIRTS',
    'JEANS',
    'SHORTS',
    'JACKETS',
    'SUIT',
    'COAT',
  ].map((t) => (
    <span
      key={t}
      onClick={() =>
        setActiveTab(activeTab === t ? '' : t)
      }
      className={`border px-5 py-1 cursor-pointer transition
        ${
          activeTab === t
            ? 'bg-gray-600 text-white'
            : 'hover:bg-gray-500 hover:text-white'
        }`}
    >
      {t}
    </span>
  ))}
</div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {filtered.map((p) => {
  const isOut = !p.in_stock
  const isFavorite = favorites.includes(p.id)

  return (
    <div key={p.id} className="relative">
      <Link
        to={
          isOut
            ? '#'
            : fromParam
              ? `/products/${p.id}?from=${encodeURIComponent(fromParam)}`
              : `/products/${p.id}`
        }
        onClick={(e) => isOut && e.preventDefault()}
        state={location?.state?.from ? { ...location.state } : undefined}
        className={isOut ? 'pointer-events-none' : ''}
      >
        <div className={`cursor-pointer ${isOut ? 'opacity-40 grayscale' : ''}`}>

          {/* IMAGE */}
          <div className="h-64 sm:h-72 lg:h-80 mb-3 flex items-center justify-center relative">
            <img
              src={p.image}
              alt={p.name}
              className="h-full object-contain"
            />
            
            {/* دکمه قلب */}
            <button
              onClick={(e) => toggleFavorite(p.id, e)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
            >
              <img 
                src={heart} 
                alt="favorite" 
                className={`w-4 h-4 transition ${isFavorite ? 'opacity-100' : 'opacity-60'}`}
                style={{ filter: isFavorite ? 'brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(5000%) hue-rotate(340deg)' : 'none' }}
              />
            </button>
          </div>

          <h3 className="font-semibold">{p.name}</h3>
          <p className="font-semibold">{p.description}</p>

          <div className="flex justify-between text-sm mt-1">
            <span>${p.price}</span>
          </div>

        </div>
      </Link>
    </div>
  )
})}

          </div>

        </div>

      </div>

    </div>

  </div>
)
}