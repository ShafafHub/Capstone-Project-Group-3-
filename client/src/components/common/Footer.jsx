export default function Footer() {
  return (
    <footer className="bg-[#f2f2f2] text-gray-600">
      <div className="max-w-[1200px] mx-auto px-8 py-24 relative">

        {/* --- LEFT SECTION - Info and Languages --- */}
        <div className="absolute left-0 top-10 text-xs tracking-[0.15em]">
          <p className="mb-5 text-gray-400">INFO</p>
          <div className="space-y-2 mb-14">
            <button className="hover:text-black transition block text-left">PRICING /</button>
            <button className="hover:text-black transition block text-left">ABOUT /</button>
            <button className="hover:text-black transition block text-left">CONTACTS</button>
          </div>

          <p className="mb-5 text-gray-400">LANGUAGES</p>
          <div className="space-y-2">
            <button className="hover:text-black transition block text-left">ENG /</button>
            <button className="hover:text-black transition block text-left">ESP /</button>
            <button className="hover:text-black transition block text-left">SVE</button>
          </div>
        </div>

        {/* --- CENTER SECTION - Technologies and XIV QR --- */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-10">
            TECHNOLOGIES
          </p>

          <div className="relative flex items-center">
            {/* --- Triangle icon --- */}
            <div className="mr-4 w-0 h-0 
              border-t-[10px] border-t-transparent
              border-b-[10px] border-b-transparent
              border-l-[16px] border-l-black">
            </div>

            <div className="text-black font-extrabold leading-[0.85]">
              <div className="text-[80px]">XIV</div>
              <div className="text-[80px]">QR</div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION - Near-field communication --- */}
        <div className="absolute right-0 top-24 text-xs text-gray-500 tracking-wide">
          <button className="hover:text-black transition">Near-field communication /</button>
        </div>
      </div>

      {/* --- BOTTOM SECTION - Copyright and privacy (side by side, no click) --- */}
      <div className="text-center text-xs pb-6 flex justify-center gap-6">
        <span className="text-gray-500">2026 © copyright Group 3</span>
        <span className="text-gray-400">privacy</span>
      </div>
    </footer>
  );
}