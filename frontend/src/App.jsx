// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UpdatePassword from './pages/Auth/UpdatePassword';
import NotFound from './pages/NotFound';

// Dashboards
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import UserDashboard from './pages/Dashboard/UserDashboard';
import StoreOwnerDashboard from './pages/Dashboard/StoreOwnerDashboard';

import './index.css'; // Import your global CSS

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<div className="container alert error">You are not authorized to view this page.</div>} />

              {/* Authenticated Routes (for any logged-in user) */}
              <Route element={<ProtectedRoute />}>
                 <Route path="/profile/update-password" element={<UpdatePassword />} />
              </Route>

              {/* Role-specific Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['system_admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['store_owner']} />}>
                <Route path="/store-owner/dashboard" element={<StoreOwnerDashboard />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['normal_user']} />}>
                <Route path="/user/stores" element={<UserDashboard />} />
              </Route>

              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;