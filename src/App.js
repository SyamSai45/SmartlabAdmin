// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

import AppLayout from "./components/layout/AppLayout";

import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import { ContactsPage } from "./pages/ContactsPage";
import { AllProducts, ProductsPage } from "./pages/products/AllProducts";
import { QuotesPage } from "./pages/QuotesPage";
import BrandsPage from "./pages/Brands";
import { ProductForm } from "./pages/products/CreateProduct";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Home */}
        <Route index element={<DashboardPage />} />

        {/* Categories */}
        <Route
          path="categories"
          element={<CategoriesPage />}
        />

        <Route
          path="priciples"
          element={<BrandsPage />}
        />

        {/* Contacts */}
        <Route
          path="contacts"
          element={<ContactsPage />}
        />

        {/* Quotes */}
        <Route
          path="quotes"
          element={<QuotesPage />}
        />

        {/* Products */}
        <Route
          path="products"
          element={<AllProducts />}
        />
        <Route
          path="addproduct"
          element={<ProductForm />}
        />

        <Route
          path="editproduct/:id"
          element={<ProductForm />}
        />

      </Route>

      {/* Default Redirect */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          sessionStorage.getItem("token") ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;