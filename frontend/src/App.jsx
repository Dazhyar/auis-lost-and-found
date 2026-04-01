import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ItemProvider } from "./context/ItemContext";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SkeletonLoader from "./components/SkeletonLoader";
import CommandKSearch from "./components/CommandKSearch";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import ClaimItem from "./pages/ClaimItem";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import "./index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// Wrapper to handle Framer Motion page transitions on route change
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={user?.is_admin ? <Navigate to="/admin/dashboard" replace /> : <PageTransition><Dashboard /></PageTransition>} />
        <Route path="/report-lost" element={user?.is_admin ? <Navigate to="/admin/dashboard" replace /> : <PageTransition><ReportLost /></PageTransition>} />
        <Route path="/report-found" element={user?.is_admin ? <Navigate to="/admin/dashboard" replace /> : <PageTransition><ReportFound /></PageTransition>} />
        <Route
          path="/claim"
          element={
            <ProtectedRoute>
              <PageTransition><ClaimItem /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <PageTransition><AdminDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Expose global loader to window so Axios interceptors can trigger it
  useEffect(() => {
    window.setGlobalLoading = setGlobalLoading;
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ItemProvider>
          <BrowserRouter>
            {globalLoading && <SkeletonLoader />}
            <CommandKSearch isOpen={isCmdKOpen} onClose={(v) => setIsCmdKOpen(v ?? false)} />

            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/*"
                element={
                  <div className="min-h-screen flex flex-col pt-16 lg:pt-20">
                    <Navbar onOpenSearch={() => setIsCmdKOpen(true)} />
                    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                      <AnimatedRoutes />
                    </main>
                  </div>
                }
              />
            </Routes>

            <Toaster
              position="top-center"
              toastOptions={{
                className: 'glass-card border-none',
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#002D72',
                  backdropFilter: 'blur(16px)',
                  fontFamily: 'Lexend, sans-serif',
                  fontWeight: 500,
                  borderRadius: '16px',
                  padding: '12px 20px',
                },
                success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
              }}
            />
          </BrowserRouter>
        </ItemProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
