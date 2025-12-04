import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Menu,
  X,
  Home,
  BookOpen,
  User,
  Heart,
  LogOut,
  TrendingUp,
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Technologies', href: '/technologies', icon: BookOpen },
    { name: 'Trending', href: '/technologies?isTrending=true', icon: TrendingUp },
    { name: 'Favourites', href: '/favourites', icon: Heart },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // Check if current route matches nav item
  const isActiveRoute = (href) => {
  // Build a URL object so we can read path + query separately
  const url = new URL(href, window.location.origin);

  const samePath = location.pathname === url.pathname;

  // If paths are different, it's not active
  if (!samePath) return false;

  // If the nav item has a query string (like ?isTrending=true),
  // then it should be active ONLY when the full search matches.
  if (url.search) {
    return location.search === url.search;
  }

  // If the nav item has NO query (like /technologies),
  // treat it as the base route and ensure we are NOT on the trending filter.
  return !location.search.includes('isTrending=true');
};


  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show navigation for landing and auth pages
  const shouldShowNavigation = !['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      {shouldShowNavigation && (
        <nav className="sticky top-0 z-50 border-b border-gray-200/40 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
          <div className="container-custom">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center space-x-2 group">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-md shadow-primary-500/30 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  NeoCube
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={[
                        'relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-2xl transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                        isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm shadow-primary-500/30'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex items-center justify-center w-7 h-7 rounded-xl mr-2 transition-all duration-200',
                          isActive
                            ? 'bg-white/20'
                            : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                        ].join(' ')}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-white/80 dark:bg-primary-300/90" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-3">
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                {/* User menu (desktop) */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm shadow-primary-500/40">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[140px] truncate">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-gray-500 hover:text-danger-600 dark:text-gray-400 dark:hover:text-danger-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-3 border-t border-gray-200/60 dark:border-gray-800/80">
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={[
                          'flex items-center px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm shadow-primary-500/30'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'flex items-center justify-center w-8 h-8 rounded-xl mr-3',
                            isActive
                              ? 'bg-white/20'
                              : 'bg-gray-100 dark:bg-gray-800',
                          ].join(' ')}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile user section */}
                <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-800/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[150px] truncate">
                        {user?.name || 'User'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl text-gray-500 hover:text-danger-600 dark:text-gray-400 dark:hover:text-danger-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {/* Footer (only for non-auth pages) */}
      {!shouldShowNavigation && (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
          <div className="container-custom">
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              <p>&copy; 2024 Tech Learning Hub. Built with ❤️ for learners.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
