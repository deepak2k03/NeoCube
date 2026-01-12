import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun, Moon, Menu, X, Home, BookOpen,
  User, Heart, LogOut, TrendingUp, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react'; // Import Layers icon

// Inside Layout component:
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Sectors', href: '/fields', icon: Layers }, // CHANGED from 'Technologies'
  { name: 'Trending', href: '/trending', icon: TrendingUp }, 
  { name: 'Favourites', href: '/favourites', icon: Heart },
  { name: 'Profile', href: '/profile', icon: User },
];
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. FIXED NAV ITEMS (Pointing to real routes)
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Technologies', href: '/technologies', icon: BookOpen },
    { name: 'Trending', href: '/trending', icon: TrendingUp }, // FIXED LINK
    { name: 'Favourites', href: '/favourites', icon: Heart },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // 2. SIMPLIFIED ACTIVE CHECK (No query params needed now)
  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const shouldShowNavigation = !['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      
      {shouldShowNavigation && (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              
              {/* Logo Area */}
              <Link to="/dashboard" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-2xl font-display font-bold text-white tracking-tight">
                  Neo<span className="text-primary">Cube</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center bg-white/5 rounded-2xl p-1.5 border border-white/5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="relative px-5 py-2.5 rounded-xl transition-all duration-300 group"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-primary/20 rounded-xl border border-primary/30"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <div className="relative z-10 flex items-center space-x-2">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-textMuted group-hover:text-white'}`} />
                        <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-textMuted group-hover:text-white'}`}>
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {/* User Profile Pill */}
                <div className="hidden md:flex items-center space-x-3 bg-surface border border-white/5 px-3 py-1.5 rounded-full hover:border-white/20 transition-colors">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                    style={{ backgroundColor: user?.avatar?.color || '#3b82f6' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-300 pr-2">
                    {user?.name || 'Operative'}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="hidden md:flex p-2.5 rounded-xl text-textMuted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-textMuted hover:text-white hover:bg-white/10"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden overflow-hidden border-t border-white/5 bg-background"
                >
                  <div className="py-4 space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            flex items-center px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all
                            ${isActive 
                              ? 'bg-primary/20 text-white border border-primary/30' 
                              : 'text-textMuted hover:bg-white/5 hover:text-white'}
                          `}
                        >
                          <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : ''}`} />
                          {item.name}
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 mx-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Disconnect Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="relative z-0">
        <Outlet /> 
        {/* Or {children} if you prefer, but Outlet is standard for Layout wrappers */}
        {children}
      </main>

    </div>
  );
};

export default Layout;