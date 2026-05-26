import { Link, useLocation } from 'react-router-dom';
import { Activity, Search, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full flex items-center justify-between border-b border-primary/20 bg-background-start/95 backdrop-blur-md sticky top-0 z-50 px-6 h-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center gap-3 w-48">
        <Activity className="text-secondary w-8 h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        <span className="font-heading text-3xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
          VIBE AI
        </span>
      </Link>

      {/* Center: Tabs */}
      <div className="flex h-full font-semibold text-sm tracking-widest relative">
        <Link
          to="/"
          className={`flex items-center px-6 h-full transition-all border-b-4 ${isActive('/') ? 'border-accent text-accent bg-accent/10 glow-pink bg-opacity-20' : 'border-transparent text-gray-300 hover:text-accent hover:bg-white/5'}`}
        >
          HOME
        </Link>

        {/* Dropdown Tab */}
        <div
          className="relative h-full flex"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link
            to="/styles"
            className={`flex items-center gap-1 px-6 h-full transition-all border-b-4 ${isActive('/styles') ? 'border-secondary text-secondary bg-secondary/10 glow-blue bg-opacity-20' : 'border-transparent text-gray-300 hover:text-secondary hover:bg-white/5'}`}
          >
            STYLES <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
          </Link>

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 w-[350px] bg-background-end border-2 border-primary/30 rounded-2xl shadow-[0_10px_40px_rgba(139,92,246,0.3)] p-3 flex flex-col gap-2 z-50"
              >
                <Link to="/styles" className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/20 transition-all group bg-black/40 border border-transparent hover:border-primary/50">
                  <div className="w-20 h-14 bg-primary/20 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 to-transparent mix-blend-overlay"></div>
                    <img src="https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Waacking" />
                  </div>
                  <div>
                    <h4 className="text-primary font-bold text-sm group-hover:text-accent transition-colors">Waacking Mode</h4>
                    <p className="text-gray-400 text-[10px] mt-1 uppercase">Dynamic arm movements</p>
                  </div>
                </Link>

                <div className="flex items-center gap-4 p-3 rounded-xl opacity-50 cursor-not-allowed bg-black/40 border border-transparent">
                  <div className="w-20 h-14 bg-gray-800 rounded-lg overflow-hidden relative grayscale">
                    <img src="https://images.unsplash.com/photo-1535525153412-5a092c206582?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Locking" />
                  </div>
                  <div>
                    <h4 className="text-gray-400 font-bold text-sm">Locking & Hip Hop</h4>
                    <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest">Coming Soon</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          to="/training"
          className={`flex items-center px-6 h-full transition-all border-b-4 ${isActive('/training') ? 'border-primary text-primary bg-primary/10 glow-purple bg-opacity-20' : 'border-transparent text-gray-300 hover:text-primary hover:bg-white/5'}`}
        >
          TRAINING
        </Link>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-5 text-gray-300 w-48 justify-end">
        <button className="hover:text-secondary hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all p-2"><Search className="w-5 h-5" /></button>
        <button className="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all p-2"><User className="w-5 h-5" /></button>
      </div>
    </nav>
  );
}
