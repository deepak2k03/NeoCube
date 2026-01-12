import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // Animation Core
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

// Lazy load components
const Layout = React.lazy(() => import("./components/Layout"));
const Landing = React.lazy(() => import("./pages/Landing"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Technologies = React.lazy(() => import("./pages/Technologies"));
const TechnologyDetail = React.lazy(() => import("./pages/TechnologyDetail"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Favourites = React.lazy(() => import("./pages/Favourites"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Trending = React.lazy(() => import("./pages/Trending"));
const Fields = React.lazy(() => import("./pages/Fields"));

// 1. THE "NEO" LOADER (Futuristic Pulse)
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
      <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-r-4 border-l-4 border-secondary animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-glow font-bold text-xs tracking-widest">
        LOADING
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  // 2. Location Hook for Animations
  const location = useLocation();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background text-textMain font-inter selection:bg-primary/30">
            <Suspense fallback={<LoadingFallback />}>
              {/* 3. AnimatePresence handles the exit animations */}
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
                    path="/signup"
                    element={
                      <PublicRoute>
                        <Signup />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
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
                    path="/trending"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Trending />
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
                    path="/fields"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Fields />
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
