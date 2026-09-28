import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  LogIn,
  Store,
  Tag,
  ChefHat,
  CreditCard,
  CheckCircle2,
  Heart,
  Package,
  WalletCards,
  ChevronDown,
  MapPin,
} from "lucide-react";

// =====================================================
// NAVBAR
// =====================================================

function Navbar() {
  const location = useLocation();

  // =====================================================
  // STATE
  // =====================================================

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const moreRef = useRef(null);

  // =====================================================
  // GET CART
  // =====================================================

  const getCart = () => {
    try {
      // Main key used by Restaurant component
      const cartItems = localStorage.getItem("cartItems");

      if (cartItems) {
        const parsedCart = JSON.parse(cartItems);

        return Array.isArray(parsedCart)
          ? parsedCart
          : [];
      }

      // Fallback for old cart key
      const oldCart = localStorage.getItem("cart");

      if (oldCart) {
        const parsedOldCart = JSON.parse(oldCart);

        return Array.isArray(parsedOldCart)
          ? parsedOldCart
          : [];
      }

      return [];
    } catch (error) {
      console.error("Cart loading error:", error);
      return [];
    }
  };

  // =====================================================
  // GET WISHLIST
  // =====================================================

  const getWishlist = () => {
    try {
      // Main key used by restaurant favorites
      const favoriteRestaurants =
        localStorage.getItem(
          "favoriteRestaurants"
        );

      if (favoriteRestaurants) {
        const parsedFavorites =
          JSON.parse(favoriteRestaurants);

        if (Array.isArray(parsedFavorites)) {
          return parsedFavorites;
        }
      }

      // Fallback for old wishlist key
      const wishlist =
        localStorage.getItem("wishlist");

      if (wishlist) {
        const parsedWishlist =
          JSON.parse(wishlist);

        return Array.isArray(parsedWishlist)
          ? parsedWishlist
          : [];
      }

      return [];
    } catch (error) {
      console.error(
        "Wishlist loading error:",
        error
      );

      return [];
    }
  };

  // =====================================================
  // UPDATE COUNTS
  // =====================================================

  const updateCounts = () => {
    try {
      const cart = getCart();

      const totalCartItems = cart.reduce(
        (total, item) => {
          return (
            total +
            Number(item?.quantity || 1)
          );
        },
        0
      );

      setCartCount(totalCartItems);

      const wishlist = getWishlist();

      setWishlistCount(wishlist.length);
    } catch (error) {
      console.error(
        "Navbar count update error:",
        error
      );

      setCartCount(0);
      setWishlistCount(0);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    updateCounts();
  }, []);

  // =====================================================
  // CART + WISHLIST EVENTS
  // =====================================================

  useEffect(() => {
    const handleStorage = () => {
      updateCounts();
    };

    const handleCartUpdate = () => {
      updateCounts();
    };

    const handleWishlistUpdate = () => {
      updateCounts();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    window.addEventListener(
      "favoritesUpdated",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );

      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );

      window.removeEventListener(
        "favoritesUpdated",
        handleWishlistUpdate
      );
    };
  }, []);

  // =====================================================
  // ROUTE CHANGE
  // =====================================================

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  // =====================================================
  // CLOSE MORE WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        moreRef.current &&
        !moreRef.current.contains(event.target)
      ) {
        setMoreOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setMoreOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // ACTIVE ROUTE
  // =====================================================

  const isActive = (path) => {
    // Home
    if (path === "/") {
      return location.pathname === "/";
    }

    // Exact match
    if (location.pathname === path) {
      return true;
    }

    // Restaurant detail pages
    if (
      path === "/restaurants" &&
      location.pathname.startsWith(
        "/restaurant/"
      )
    ) {
      return true;
    }

    return false;
  };

  // =====================================================
  // CLOSE MENUS
  // =====================================================

  const closeMenus = () => {
    setMobileOpen(false);
    setMoreOpen(false);
  };

  // =====================================================
  // NAVIGATION CLICK
  // =====================================================

  const handleNavigation = () => {
    closeMenus();

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  // =====================================================
  // DESKTOP LINK CLASS
  // =====================================================

  const desktopLink = (path) => {
    return `
      flex
      items-center
      gap-1.5
      rounded-lg
      px-2
      py-2
      text-sm
      font-semibold
      transition
      ${
        isActive(path)
          ? "bg-orange-50 text-orange-500"
          : "text-slate-700 hover:bg-orange-50 hover:text-orange-500"
      }
    `;
  };

  // =====================================================
  // MOBILE LINK CLASS
  // =====================================================

  const mobileLink = (path) => {
    return `
      flex
      items-center
      gap-3
      border-b
      border-slate-100
      px-5
      py-4
      text-sm
      font-semibold
      transition
      ${
        isActive(path)
          ? "bg-orange-50 text-orange-500"
          : "text-slate-700 hover:bg-orange-50 hover:text-orange-500"
      }
    `;
  };

  // =====================================================
  // BADGE
  // =====================================================

  const formatCount = (count) => {
    return count > 99 ? "99+" : count;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          onClick={handleNavigation}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 transition duration-300 group-hover:scale-105">
            <ChefHat size={25} />
          </div>

          <div className="hidden sm:block">
            <div className="text-2xl font-black leading-none tracking-tight text-orange-500">
              BiteRush
            </div>

            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <MapPin size={10} />
              Food Delivery
            </div>
          </div>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="hidden items-center gap-1 lg:flex">

          {/* HOME */}

          <Link
            to="/"
            onClick={handleNavigation}
            className={desktopLink("/")}
          >
            Home
          </Link>

          {/* RESTAURANTS */}

          <Link
            to="/restaurants"
            onClick={handleNavigation}
            className={desktopLink(
              "/restaurants"
            )}
          >
            <Store size={17} />
            Restaurants
          </Link>


          <Link
            to="/search"
            onClick={handleNavigation}
            className={desktopLink("/search")}
          >
            <Search size={17} />
            Search
          </Link>

          {/* CART */}

          <Link
            to="/cart"
            onClick={handleNavigation}
            className={`
              relative
              flex
              items-center
              gap-1.5
              rounded-lg
              px-2
              py-2
              text-sm
              font-semibold
              transition
              ${
                isActive("/cart")
                  ? "bg-orange-50 text-orange-500"
                  : "text-slate-700 hover:bg-orange-50 hover:text-orange-500"
              }
            `}
          >
            <ShoppingCart size={18} />

            Cart

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-sm">
                {formatCount(cartCount)}
              </span>
            )}
          </Link>

          {/* =================================================
              MORE DROPDOWN
          ================================================= */}

          <div
            ref={moreRef}
            className="relative ml-1"
          >
            <button
              type="button"
              onClick={() =>
                setMoreOpen(
                  (previous) => !previous
                )
              }
              className={`
                flex
                items-center
                gap-1.5
                rounded-lg
                px-3
                py-2
                text-sm
                font-semibold
                transition
                ${
                  moreOpen
                    ? "bg-orange-50 text-orange-500"
                    : "text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                }
              `}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              <Menu size={17} />

              More

              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  moreOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl">

                {/* CHECKOUT */}

                <Link
                  to="/checkout"
                  onClick={handleNavigation}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-500"
                >
                  <CreditCard
                    size={18}
                  />

                  <span>
                    Checkout
                  </span>
                </Link>

                {/* PAYMENT */}

                <Link
                  to="/payment"
                  onClick={handleNavigation}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-500"
                >
                  <WalletCards
                    size={18}
                  />

                  <span>
                    Payment
                  </span>
                </Link>

                {/* ORDERS */}

                <Link
                  to="/orders"
                  onClick={handleNavigation}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-500"
                >
                  <Package size={18} />

                  <span>
                    My Orders
                  </span>
                </Link>

                {/* ORDER SUCCESS */}

                <Link
                  to="/order-success"
                  onClick={handleNavigation}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-600"
                >
                  <CheckCircle2
                    size={18}
                  />

                  <span>
                    Order Success
                  </span>
                </Link>

                {/* DIVIDER */}

                <div className="my-1 border-t border-slate-100" />

                {/* WISHLIST */}

                <Link
                  to="/wishlist"
                  onClick={handleNavigation}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-500"
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} />

                    Wishlist
                  </span>

                  {wishlistCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                      {formatCount(
                        wishlistCount
                      )}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="hidden items-center gap-3 lg:flex">

        

          {/* PROFILE */}

          <Link
            to="/profile"
            onClick={handleNavigation}
            title="My Profile"
            aria-label="My Profile"
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              text-white
              shadow-md
              transition
              hover:scale-105
              ${
                isActive("/profile")
                  ? "bg-red-500"
                  : "bg-orange-500 hover:bg-orange-600"
              }
            `}
          >
            <User size={19} />
          </Link>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (previous) => !previous
            )
          }
          className="rounded-xl p-2.5 text-slate-700 transition hover:bg-orange-50 hover:text-orange-500 lg:hidden"
          aria-label={
            mobileOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={27} />
          ) : (
            <Menu size={27} />
          )}
        </button>
      </div>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {mobileOpen && (
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto border-t border-slate-100 bg-white shadow-xl lg:hidden">

          {/* MOBILE HEADER */}

          <div className="border-b border-orange-100 bg-linear-to-r from-orange-50 to-amber-50 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Welcome to BiteRush
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Order your favorite food 🍕
            </p>
          </div>

          {/* HOME */}

          <Link
            to="/"
            onClick={handleNavigation}
            className={mobileLink("/")}
          >
            <span>Home</span>
          </Link>

          {/* RESTAURANTS */}

          <Link
            to="/restaurants"
            onClick={handleNavigation}
            className={mobileLink(
              "/restaurants"
            )}
          >
            <Store size={19} />

            Restaurants
          </Link>


          {/* SEARCH */}

          <Link
            to="/search"
            onClick={handleNavigation}
            className={mobileLink("/search")}
          >
            <Search size={19} />

            Search
          </Link>

          {/* CART */}

          <Link
            to="/cart"
            onClick={handleNavigation}
            className={mobileLink("/cart")}
          >
            <ShoppingCart size={19} />

            <span>Cart</span>

            {cartCount > 0 && (
              <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white">
                {formatCount(cartCount)}
              </span>
            )}
          </Link>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            onClick={handleNavigation}
            className={mobileLink(
              "/wishlist"
            )}
          >
            <Heart size={19} />

            <span>Wishlist</span>

            {wishlistCount > 0 && (
              <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white">
                {formatCount(
                  wishlistCount
                )}
              </span>
            )}
          </Link>

          {/* DIVIDER */}

          <div className="my-1 border-t border-slate-100" />

          {/* CHECKOUT */}

          <Link
            to="/checkout"
            onClick={handleNavigation}
            className={mobileLink(
              "/checkout"
            )}
          >
            <CreditCard size={19} />

            Checkout
          </Link>

          {/* PAYMENT */}

          <Link
            to="/payment"
            onClick={handleNavigation}
            className={mobileLink(
              "/payment"
            )}
          >
            <WalletCards size={19} />

            Payment
          </Link>

          {/* ORDERS */}

          <Link
            to="/orders"
            onClick={handleNavigation}
            className={mobileLink("/orders")}
          >
            <Package size={19} />

            Orders
          </Link>

          {/* ORDER SUCCESS */}

          <Link
            to="/order-success"
            onClick={handleNavigation}
            className={mobileLink(
              "/order-success"
            )}
          >
            <CheckCircle2 size={19} />

            Order Success
          </Link>

          {/* LOGIN */}


          {/* PROFILE */}

          <Link
            to="/profile"
            onClick={handleNavigation}
            className={mobileLink(
              "/profile"
            )}
          >
            <User size={19} />

            Profile
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
