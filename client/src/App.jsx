import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

// Lazy load components
const Layout = React.lazy(() => import("./components/Layout"));
const Landing = React.lazy(() => import("./pages/Landing"));
const Login = React.lazy(() => import("./pages/Login"));
// ✅ FIX: Import matches the file name (pages/Register.jsx)
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Technologies = React.lazy(() => import("./pages/Technologies"));
const TechnologyDetail = React.lazy(() => import("./pages/TechnologyDetail"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Favourites = React.lazy(() => import("./pages/Favourites"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Trending = React.lazy(() => import("./pages/Trending"));
const AdminCreate = React.lazy(() => import("./pages/AdminCreate"));
import AdminRoute from "./components/AdminRoute";
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-blue-500 font-bold">
    LOADING...
  </div>
);

// ✅ PROTECTED: If NOT logged in, go to Login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ✅ PUBLIC: If ALREADY logged in, go to Dashboard (Fields)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
            <Suspense fallback={<LoadingFallback />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Landing />
                      </Layout>
                    }
                  />

                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />

                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/create"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <AdminCreate />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/technologies"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Technologies />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/technologies/:slug"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <TechnologyDetail />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Profile />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/favourites"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Favourites />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/trending"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Trending />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* 🔥 ADMIN ONLY ROUTES */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminCreate />} />
                  </Route>
                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <Layout>
                        <NotFound />
                      </Layout>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </div>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
