import { useState } from "react";
import { Heart, ShoppingBag, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Menu from "../../assets/Menu.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="w-full bg-[#f2f2f2]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[70px] px-6">
          {/* LEFT */}
          <div className="flex items-center gap-10">
            {/* Mobile */}
            <button
              onClick={() => setOpen(true)}
              className="flex flex-col gap-[4px]"
            >
              <img src={Menu} size={22} />
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-8 text-sm text-gray-500">
              <Link to="/home" className="hover:text-black transition">Home</Link>
              <Link to="/collections" className="hover:text-black transition">Collections</Link>
              <Link to="/new" className="hover:text-black transition">New</Link>
            </div>
          </div>

          {/* CENTER LOGO */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-lg tracking-[0.4em]">
              <img src={logo} className="w-10" />
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            {/* Heart */}
            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
              <Heart size={16} color="white" />
            </div>

            <div className="flex items-center bg-black rounded-full overflow-hidden">
              {/* Cart text */}
              <span className="text-white text-sm px-4 py-1">cart</span>

              {/* Bag icon */}
              <div className="bg-white px-2 py-1 rounded-full flex items-center justify-center">
                <ShoppingBag size={15} />
              </div>
            </div>

            {/* User */}
            <div className="w-9 h-9 bg-black text-white border border-gray-300 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition duration-300`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <span className="tracking-widest text-sm">MENU</span>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className="flex flex-col gap-8 p-6 text-2xl tracking-widest">
          <Link to="/home">Home</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/new">New</Link>

          <div className="mt-10 flex flex-col gap-4 text-lg">
            <span>MEN</span>
            <span>WOMEN</span>
            <span>KIDS</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
