import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import PageLoader from './components/ui/PageLoader';
import NotFound from './pages/NotFound'; // Imported the new 404 page

const ProtectedRoute = ({ children }) => {
  const { admin, loading: authLoading } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-color)]" />;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  if (showSplash) {
    return <PageLoader onComplete={() => setShowSplash(false)} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Layout Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
            </Route>

            {/* Global 404 Error Handler - Captures everything else */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;