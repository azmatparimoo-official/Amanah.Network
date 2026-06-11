import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../amanahlogo.png'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/register", label: "Register" },
    { to: "/council", label: "Council" },
    { to: "/associates", label: "Associates" },
    { to: "/contact", label: "Contact" },
    { to: "/vision", label: "Vision" },
    { to: "/donate", label: "Donate Portal" },
    { to: "/request-aid", label: "Request Aid Portal" },
    { to: "/timeline", label: "Achievements" },
  ];

  return (
    /* py-8 creates the 'Beautiful Deck' height, matching the logo size perfectly */
    <nav className="relative bg-white border-b border-gray-100 py-8 px-6 md:px-12 lg:px-24 z-50">
      <div className="flex justify-between items-center max-w-1400px mx-auto">
        
       {/* Left: Logo & Branding */}
      <Link to="/" className="flex items-center gap-3 group">
        <img src={logo} alt="Amanah Network" className="h-12 w-auto object-contain" />
        <div className="flex flex-col">
      <span className="text-2xl font-black uppercase tracking-tighter leading-none text-[#284D3D]">
    Amanah</span>   
      <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em]">
      Network </span>       
    </div>
      </Link>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-2xl focus:outline-none"
        >
          ☰
        </button>

        {/* Desktop Links - Perfectly centered vertically against the logo */}
        <div className="hidden md:flex gap-8 uppercase font-bold text-[10px] tracking-[0.2em] text-gray-800 items-center">
          {navLinks.map((link, index) => (
            <Link 
              key={`${link.to}-${index}`} 
              to={link.to} 
              className="hover:text-[#C5A059] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col p-6 bg-white border-t border-gray-100 uppercase font-bold text-xs gap-6 mt-8 shadow-2xl">
          {navLinks.map((link, index) => (
            <Link 
              key={`${link.to}-${index}`} 
              to={link.to} 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#C5A059] border-b border-gray-50 pb-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}