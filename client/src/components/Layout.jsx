import React from 'react';
import { useLocation } from 'react-router-dom';
// ✅ Import the new Navbar we just created
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();

  // Define routes where Navbar should NOT appear (Login/Register/Landing)
  const hideNavbarRoutes = ['/', '/login', '/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    // ✅ Using zinc-950 to match the NeoCube theme perfectly
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
      
      {/* Conditionally Render Navbar */}
      {shouldShowNavbar && <Navbar />}

      {/* Main Content */}
      <main className="relative z-0">
        {children}
      </main>
      
    </div>
  );
};

export default Layout;