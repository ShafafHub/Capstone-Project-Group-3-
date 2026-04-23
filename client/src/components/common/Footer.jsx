export default function Footer() {
  return (
    <footer className="relative bg-[#f2f2f2] text-gray-500">
      <div className="relative max-w-[1200px] mx-auto py-12">

        {/* LEFT */}
        <div className="absolute left-0 top-10 text-[10px] tracking-[0.25em]">
          <div className="mb-8">
            <div className="text-gray-400 mb-2">INFO</div>
            <div className="flex flex-col gap-1">
              <span className="hover:text-black transition-colors cursor-pointer">PRICING /</span>
              <span className="hover:text-black transition-colors cursor-pointer">ABOUT /</span>
              <span className="hover:text-black transition-colors cursor-pointer">CONTACTS</span>
            </div>
          </div>

          <div>
            <div className="text-gray-400 mb-2">LANGUAGES</div>
            <div className="flex flex-col gap-1">
              <span className="hover:text-black transition-colors cursor-pointer">ENG /</span>
              <span className="hover:text-black transition-colors cursor-pointer">ESP /</span>
              <span className="hover:text-black transition-colors cursor-pointer">SVE</span>
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-[10px] tracking-[0.35em] text-gray-400 mb-4">
            TECHNOLOGIES
          </div>

          <div className="flex items-center">
            <div className="w-0 h-0 border-l-[10px] border-l-black border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent mr-3"></div>

            <div className="text-black font-black leading-none">
              <div className="text-[80px]">XIV</div>
              <div className="text-[80px]">QR</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="absolute right-0 top-16 text-[10px] text-gray-400">
          <span className="hover:text-black transition-colors cursor-pointer">
            Near-field communication /
          </span>
        </div>

        {/* BOTTOM */}
        <div className="absolute bottom-6 left-0 w-full flex justify-between text-[10px] px-2">
          <div className="text-gray-600">
            2026 © copyright Group 3
          </div>
          <div className="text-gray-400">
            privacy
          </div>
        </div>

      </div>
    </footer>
  );
}