import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import InventoryPage from "./components/InventoryPage";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import ProductDetailPage from "./components/ProductDetailPage";
import { setAuthToken } from "./services/api";
import { jwtDecode } from "jwt-decode";
import AddProductPage from "./components/AddProductPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenValid(token)) {
      setAuthToken(token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/landing" />
              ) : (
                <LoginPage setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/landing"
            element={isAuthenticated ? <LandingPage /> : <Navigate to="/" />}
          />
          <Route
            path="/inventory/:clientId"
            element={
              isAuthenticated ? (
                <InventoryPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/product/:productId"
            element={
              isAuthenticated ? <ProductDetailPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/add-product"
            element={isAuthenticated ? <AddProductPage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (e) {
    return false;
  }
}

export default App;
