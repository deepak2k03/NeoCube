import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BookOpen, TrendingUp, Heart, User, 
  LogOut, Menu, X, Zap, PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const allNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, adminOnly: false },
    { name: 'Technologies', href: '/technologies', icon: BookOpen, adminOnly: false },
    { name: 'Trending', href: '/trending', icon: TrendingUp, adminOnly: false },
    { name: 'Favourites', href: '/favourites', icon: Heart, adminOnly: false },
    { name: 'Create', href: '/admin', icon: PlusCircle, adminOnly: true },
    { name: 'Profile', href: '/profile', icon: User, adminOnly: false },
  ];

  const navItems = allNavItems.filter(item => {
    if (item.adminOnly) return user?.role === 'admin';
    return true;
  });

  const isActiveRoute = (href) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl w-full">
      <div className="w-full px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              Neo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Cube</span>
            </span>
          </Link>

          {/* DESKTOP NAV - Visible on XL (1280px) and up */}
          <div className="hidden xl:flex items-center bg-white/5 rounded-full p-1.5 border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-6 py-2.5 rounded-full transition-all duration-300 group"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-zinc-800 rounded-full border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center space-x-2">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <span className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-white mb-0.5">
                  {user?.name?.split(' ')[0] || 'Operative'}
                </span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Administrator' : 'Level 1'}
                </span>
              </div>
            </div>
            
            {/* Logout - Hidden on smaller screens */}
            <button onClick={handleLogout} className="hidden xl:flex p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>

            {/* HAMBURGER BUTTON - Visible below XL */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="xl:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="xl:hidden overflow-hidden border-t border-white/5 bg-zinc-950"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 mx-2 rounded-xl text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-white">
                    <item.icon className="w-5 h-5 mr-3" /> {item.name}
                  </Link>
                ))}
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 mx-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10">
                  <LogOut className="w-5 h-5 mr-3" /> Disconnect Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;