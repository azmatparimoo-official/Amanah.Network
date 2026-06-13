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
    { to: "/timeline", label: "Achievements" },
    { to: "/terms", label: "Terms" }
  ];

 return (
    <nav className="relative bg-white border-b border-gray-100 h-24 z-50 flex items-center">
      
      {/* 1. Logo Container - Absolute position sticks it to extreme left */}
      <div className="absolute left-0 pl-6 md:pl-12 lg:pl-24 h-full flex items-center">
        <Link to="/" className="flex items-center gap-3 group h-full">
          <img src={logo} alt="Amanah Network" className="h-full w-auto py-2 object-contain" />
          <div className="flex flex-col">
            <span className="text-2xl font-black uppercase tracking-tighter leading-none text-[#284D3D]">
              Amanah</span>   
            <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em]">
              Network </span>      
          </div>
        </Link>
      </div>

      {/* 2. Links Container - Constrained to 1400px but pushes links to the right */}

      <div>
        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-2xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-24 left-0 w-full md:hidden flex flex-col p-6 bg-white border-b border-gray-100 uppercase font-bold text-xs gap-6 shadow-2xl z-40">
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