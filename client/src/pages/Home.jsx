import { useState } from 'react';
import { useProducts } from '../context/useProducts.js'
import { Link } from 'react-router-dom';
import searchIcon from '../assets/magnifying-glass.png';
import previousIcon from '../assets/prev.png';
import nextIcon from '../assets/next.png';
import down from '../assets/down-arrow.png';

export default function Home() {

  // --- state: search ---
  const [search, setSearch] = useState("");
  const { products, loading } = useProducts();

  // --- state: sliders ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

  // --- state: filters & pagination ---
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("default");

  // --- constants ---
  const itemsPerPage = 4;
  const heroItemsPerSlide = 2;

  // --- hero slider controls ---
  const nextHero = () => {
    if (heroIndex + heroItemsPerSlide < filteredHeroProducts.length) {
      setHeroIndex(prev => prev + heroItemsPerSlide);
    }
  };

  const prevHero = () => {
    if (heroIndex > 0) {
      setHeroIndex(prev => prev - heroItemsPerSlide);
    }
  };

  // --- filter & sort products ---
  const filtered = products
    .filter(p => {
      const matchCategory = category === "all" || p.category === category;
      const matchSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  // --- new products ---
  const newProducts = products.filter(p => p.is_new);

  // --- slider controls ---
  const next = () => {
    if (currentIndex + itemsPerPage < newProducts.length) {
      setCurrentIndex(prev => prev + itemsPerPage);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - itemsPerPage);
    }
  };

  // --- hero filtered products ---
  const filteredHeroProducts = search
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* --- HERO SECTION --- */}
      <section className="max-w-[1280px] mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-2">

        <div className="flex flex-col justify-center">

          {/* --- category links --- */}
          <div className="hidden lg:flex flex-col text-[13px] tracking-[3px] space-y-2 text-gray-600 mt-8">
            <Link to="/men">MEN</Link>
            <Link to="/women">WOMEN</Link>
            <Link to="/kids">KIDS</Link>
          </div>

          {/* --- search input --- */}
          <div className="hidden lg:flex items-center bg-gray-200 w-full sm:w-[330px] px-4 py-3 mb-20 mt-5 text-sm text-gray-500">
            <img src={searchIcon} className="w-5 h-5" />
           <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-right"
            />
          </div>

          {/* --- title --- */}
          <h1 className="text-[36px] sm:text-[48px] lg:text-[72px] font-extrabold leading-none">
            NEW <br /> COLLECTION
          </h1>

          {/* --- subtitle --- */}
          <div className="mt-5 tracking-[3px]">
            <span>SUMMER</span><br />
            <span>2026</span>
          </div>

          {/* --- actions --- */}
          <div className="mt-10 flex items-center gap-5">

          <Link
            to="/collections"
           className="inline-flex justify-between bg-gray-200 mr-14 px-4 py-2 w-full sm:w-[290px]"
          >
            <span>Go To Shop</span>
            <img src={nextIcon} className=" mt-1 mb-1  w-5 h-5" />
          </Link>

            <button onClick={prevHero} className="border p-2">
                <img src={previousIcon} className="w-5 h-4" />
            </button>

             <button onClick={nextHero} className="border p-2">
            <img src={nextIcon} className="w-5 h-4" />
            </button>

            </div>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 relative lg:top-20">

        {search.trim() !== "" && filteredHeroProducts.length === 0 ? (
    
    <div className="col-span-2 flex items-center justify-center h-[260px] text-gray-500 text-lg">
      Product not found
    </div>

  ) : (
    
    filteredHeroProducts.slice(heroIndex, heroIndex + heroItemsPerSlide)
      .map(p => (
        <Link to={`/products/${p.id}`} key={p.id}>

          <div className="group">

            <div className="relative h-[220px] sm:h-[280px] lg:h-[320px] w-full mt-10 lg:top-40 overflow-hidden">

              <img
                src={p.image}
                className="w-full h-[200px] sm:h-[260px] lg:h-[310px] object-contain"
              />

            </div>

          </div>

        </Link>
      ))

  )}

</div>

      </section>

      {/* --- NEW THIS WEEK --- */}
      <section className="max-w-[1280px] mx-auto px-6 py-12">

        <div className="flex justify-between mb-8">
          <h2 className="text-[50px] font-extrabold leading-10">
            NEW <br /> THIS WEEK
          </h2>

          <Link to="/new" className="text-sm text-gray-500">
            See All
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">

              {newProducts
  .slice(currentIndex, currentIndex + itemsPerPage)
                .map((p) => (

                  <Link to={`/products/${p.id}`} key={p.id}>

                    <div className="group">

  <div className="relative h-[200px] lg:h-[280px] w-full overflow-hidden">

    <img
  src={p.image}
  className="w-full h-full object-contain"
/>

  </div>

                      <h3 className="text-sm mt-3">{p.name}</h3>
                      <p className="font-semibold text-sm">{p.description}</p>
                      <p className="text-gray-500 text-sm">${p.price}</p>

                    </div>
                  </Link>
              ))}
            </div>

            {/* --- slider buttons --- */}
            <div className="flex justify-center mt-6 gap-8">

              <button onClick={prev} className=" border px-3 py-1">
                <img src={previousIcon} className="w-6 h-6"/>
                </button>

              <button onClick={next} className=" border px-3 py-1">
                <img src={nextIcon} className="w-6 h-6"/>
                </button>
            </div>
          </>
        )}

      </section>

      {/* --- COLLECTION --- */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">

        <h2 className="text-[50px] font-extrabold mb-6 leading-10">
          XIV <br /> COLLECTIONS <br /> 25-26
        </h2>

        {/* --- filters --- */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between mb-6">

          <div className="flex flex-wrap gap-3 text-sm">
            {["all", "men", "women", "kids"].map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={category === c ? "font-bold" : ""}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>

         <div className="relative w-full sm:w-[160px]">
  <select
    onChange={(e) => setSort(e.target.value)}
    className="w-full appearance-none bg-gray-100 border border-gray-200 px-4 py-2 pr-8 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
  >
    <option value="default">Filter</option>
    <option value="low">Price Low</option>
    <option value="high">Price High</option>
  </select>

  <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
    <img src={down} className="w-6 h-6"/>
  </span>
</div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {filtered
          .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
          .map(p => (
            <Link to={`/products/${p.id}`} key={p.id}>

  <div className="group">

    <div className="relative h-[300px] w-full overflow-hidden">

      <img
        src={p.image}
        className="w-full h-full object-contain"
      />

    </div>

    <h3 className="mt-3">{p.name}</h3>
    <p className="font-semibold">{p.description}</p>
    <p className="text-gray-600">${p.price}</p>

  </div>

</Link>

          ))}

        </div>

<div className="flex justify-center mt-10 gap-3">

  <button
    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
    disabled={page === 0}
    className="border px-3 py-1"
  >
   <img src={previousIcon} className="w-6 h-6"/>
  </button>

  <button
     onClick={() => {
      if ((page + 1) * itemsPerPage < filtered.length) {
        setPage(prev => prev + 1);
      }
    }}
    disabled={(page + 1) * itemsPerPage >= filtered.length}
    className="border px-3 py-1"
  >
    <img src={nextIcon} className="w-6 h-6"/>
  </button>

</div>

      </section>

      {/* --- ABOUT --- */}
      <section className="py-20 text-center px-6">

        <h2 className="text-4xl mb-3 tracking-widest font-bold">
          OUR APPROACH TO FASHION DESIGN
        </h2>

        <p className="text-xl max-w-xl mx-auto text-gray-700 font-light">
          at elegant vogue , we blend creativity with craftsmanship to create <br />
          fashion that transcends trends and stands the test of time each <br />
          design is meticulously crafted, ensuring the highest <br /> 
          quality exquisite finish
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <img src="/images/Rectangle 16.png" />
          <img className='mt-6 sm:mt-16' src="/images/Rectangle 14.png" />
          <img src="/images/Rectangle 12.png" />
          <img className='mt-6 sm:mt-16' src="/images/Rectangle 15 (1).png" />
        </div>

      </section>

    </div>
  );
}