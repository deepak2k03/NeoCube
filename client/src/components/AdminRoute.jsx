import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShieldAlert, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a spinner

  // If not logged in, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but NOT admin, show Access Denied UI
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-zinc-900/50 border border-red-500/20 rounded-3xl p-10 backdrop-blur-xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Access Restricted</h1>
          <p className="text-zinc-400 mb-8">
            This frequency is encrypted. You do not have the required clearance level (ADMIN) to view this console.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
          >
            Return to Safety
          </button>
        </div>
      </div>
    );
  }

  // If Admin, render the child route (The Admin Console)
  return <Outlet />;
};

export default AdminRoute;