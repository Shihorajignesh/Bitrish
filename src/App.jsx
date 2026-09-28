import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==================================================
// COMPONENTS
// ==================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ==================================================
// PAGES
// ==================================================

import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Search from "./pages/Search";
import Cart from "./pages/Cart";

// ==================================================
// AUTH PAGES
// ==================================================

import Loginsection from "./contexts/Loginsection";
import Signupsection from "./contexts/Signupsection";

// ==================================================
// USER
// ==================================================

import Profilesection from "./contexts/Profilesection";
import Wishlistsection from "./contexts/Wishlishtsection";

// ==================================================
// ORDER
// ==================================================

import Checkoutsection from "./contexts/Checkoutsection";
import Payment from "./contexts/Paymentmethod";
import Ordersuccess from "./contexts/Ordersuccess";
import Orderdetail from "./contexts/Orderdetail";
import Orderdata from "./contexts/Orderdata";

// ==================================================
// CONTEXT
// ==================================================

import { SearchProvider } from "./contexts/SearchContext";

// ==================================================
// LAYOUT
// ==================================================

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

// ==================================================
// APP
// ==================================================

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Routes>

          {/* =========================================
              LOGIN
          ========================================= */}

          <Route
            path="/login"
            element={<Loginsection />}
          />

          {/* =========================================
              SIGN UP
          ========================================= */}

          <Route
            path="/signup"
            element={<Signupsection />}
          />

          {/* =========================================
              HOME
          ========================================= */}

          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          {/* =========================================
              RESTAURANTS
          ========================================= */}

          <Route
            path="/restaurants"
            element={
              <Layout>
                <Restaurant />
              </Layout>
            }
          />

          {/* =========================================
              SEARCH
          ========================================= */}

          <Route
            path="/search"
            element={
              <Layout>
                <Search />
              </Layout>
            }
          />

          {/* =========================================
              CART
          ========================================= */}

          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />

          {/* =========================================
              PROFILE
          ========================================= */}

          <Route
            path="/profile"
            element={
              <Layout>
                <Profilesection />
              </Layout>
            }
          />

          {/* =========================================
              WISHLIST
          ========================================= */}

          <Route
            path="/wishlist"
            element={
              <Layout>
                <Wishlistsection />
              </Layout>
            }
          />

          {/* =========================================
              CHECKOUT
          ========================================= */}

          <Route
            path="/checkout"
            element={
              <Layout>
                <Checkoutsection />
              </Layout>
            }
          />

          {/* =========================================
              PAYMENT
          ========================================= */}

          <Route
            path="/payment"
            element={
              <Layout>
                <Payment />
              </Layout>
            }
          />

          {/* =========================================
              ORDER SUCCESS
          ========================================= */}

          <Route
            path="/order-success"
            element={
              <Layout>
                <Ordersuccess />
              </Layout>
            }
          />

          {/* =========================================
              ORDER DETAIL
          ========================================= */}

          <Route
            path="/order-detail"
            element={
              <Layout>
                <Orderdetail />
              </Layout>
            }
          />

          {/* =========================================
              MY ORDERS
          ========================================= */}

          <Route
            path="/orders"
            element={
              <Layout>
                <Orderdata />
              </Layout>
            }
          />

          {/* =========================================
              UNKNOWN URL
          ========================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;