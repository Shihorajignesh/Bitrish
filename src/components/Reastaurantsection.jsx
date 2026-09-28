import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  Star,
  Clock3,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  X,
  CheckCircle2,
  Plus,
  Sparkles,
} from "lucide-react";

// ======================================================
// RESTAURANT DATA
// ======================================================

const restaurantsData = [
  {
    id: 1,
    name: "Pizza Palace",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
    cuisine: "Pizza, Italian, Fast Food",
    category: "Pizza",
    rating: 4.8,
    reviews: 1240,
    deliveryTime: "25-30 min",
    priceForTwo: 450,
    offer: "50% OFF",
    distance: "1.2 km",
    isOpen: true,
    popular: true,
  },

  {
    id: 2,
    name: "Burger House",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    cuisine: "Burgers, American, Fast Food",
    category: "Burger",
    rating: 4.7,
    reviews: 980,
    deliveryTime: "20-25 min",
    priceForTwo: 350,
    offer: "40% OFF",
    distance: "0.8 km",
    isOpen: true,
    popular: true,
  },

  {
    id: 3,
    name: "Spice Garden",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
    cuisine: "Indian, Gujarati, Thali",
    category: "Indian",
    rating: 4.6,
    reviews: 760,
    deliveryTime: "30-35 min",
    priceForTwo: 500,
    offer: "20% OFF",
    distance: "2.1 km",
    isOpen: true,
    popular: true,
  },

  {
    id: 4,
    name: "Dragon Bowl",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    cuisine: "Chinese, Asian, Noodles",
    category: "Chinese",
    rating: 4.5,
    reviews: 620,
    deliveryTime: "25-30 min",
    priceForTwo: 400,
    offer: "30% OFF",
    distance: "1.7 km",
    isOpen: true,
    popular: false,
  },

  {
    id: 5,
    name: "Sweet Heaven",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
    cuisine: "Desserts, Cakes, Ice Cream",
    category: "Dessert",
    rating: 4.9,
    reviews: 1500,
    deliveryTime: "15-20 min",
    priceForTwo: 300,
    offer: "25% OFF",
    distance: "1.0 km",
    isOpen: true,
    popular: true,
  },

  {
    id: 6,
    name: "South Spice",
    image:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=80",
    cuisine: "South Indian, Dosa, Idli",
    category: "South Indian",
    rating: 4.4,
    reviews: 540,
    deliveryTime: "20-30 min",
    priceForTwo: 280,
    offer: "15% OFF",
    distance: "2.5 km",
    isOpen: true,
    popular: false,
  },

  {
    id: 7,
    name: "Royal Thali",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    cuisine: "Gujarati, Indian, Thali",
    category: "Indian",
    rating: 4.7,
    reviews: 890,
    deliveryTime: "25-30 min",
    priceForTwo: 420,
    offer: "35% OFF",
    distance: "1.5 km",
    isOpen: true,
    popular: true,
  },

  {
    id: 8,
    name: "Pasta Corner",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
    cuisine: "Pasta, Italian, Continental",
    category: "Pizza",
    rating: 4.5,
    reviews: 430,
    deliveryTime: "30-35 min",
    priceForTwo: 550,
    offer: "25% OFF",
    distance: "2.8 km",
    isOpen: false,
    popular: false,
  },
];

// ======================================================
// CATEGORIES
// ======================================================

const categories = [
  "All",
  "Pizza",
  "Burger",
  "Indian",
  "Chinese",
  "Dessert",
  "South Indian",
];

// ======================================================
// LOCAL STORAGE HELPERS
// ======================================================

const FAVORITES_KEY = "favoriteRestaurants";
const CART_KEY = "cartItems";

// ======================================================
// GET FAVORITE RESTAURANTS
// ======================================================

const getFavoriteRestaurants = () => {
  try {
    const savedFavorites = JSON.parse(
      localStorage.getItem(FAVORITES_KEY)
    );

    if (!Array.isArray(savedFavorites)) {
      return [];
    }

    // Convert old/string IDs into numbers
    return savedFavorites
      .map(Number)
      .filter((id) => Number.isFinite(id));
  } catch (error) {
    console.error("Favorite loading error:", error);
    return [];
  }
};

// ======================================================
// SAVE FAVORITES
// ======================================================

const saveFavoriteRestaurants = (favorites) => {
  try {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );

    // Notify other components
    window.dispatchEvent(
      new CustomEvent("favoritesUpdated", {
        detail: {
          favorites,
        },
      })
    );
  } catch (error) {
    console.error("Favorite saving error:", error);
  }
};

// ======================================================
// GET CART
// ======================================================

const getCartItems = () => {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem(CART_KEY)
    );

    return Array.isArray(savedCart)
      ? savedCart
      : [];
  } catch (error) {
    console.error("Cart loading error:", error);
    return [];
  }
};

// ======================================================
// GET CART COUNT
// ======================================================

const getCartCount = () => {
  const cart = getCartItems();

  return cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );
};

// ======================================================
// RESTAURANT COMPONENT
// ======================================================

function Restaurant() {
  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Recommended");

  const [favorites, setFavorites] = useState(
    getFavoriteRestaurants
  );

  const [showFilters, setShowFilters] =
    useState(false);

  const [onlyOpen, setOnlyOpen] =
    useState(false);

  const [onlyOffers, setOnlyOffers] =
    useState(false);

  const [cartCount, setCartCount] =
    useState(getCartCount);

  // ======================================================
  // LOAD FAVORITES
  // ======================================================

  useEffect(() => {
    setFavorites(getFavoriteRestaurants());
  }, []);

  // ======================================================
  // FAVORITE UPDATE LISTENER
  // ======================================================

  useEffect(() => {
    const updateFavorites = () => {
      setFavorites(getFavoriteRestaurants());
    };

    window.addEventListener(
      "favoritesUpdated",
      updateFavorites
    );

    window.addEventListener(
      "storage",
      updateFavorites
    );

    return () => {
      window.removeEventListener(
        "favoritesUpdated",
        updateFavorites
      );

      window.removeEventListener(
        "storage",
        updateFavorites
      );
    };
  }, []);

  // ======================================================
  // CART UPDATE LISTENER
  // ======================================================

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    window.addEventListener(
      "storage",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );
    };
  }, []);

  // ======================================================
  // FAVORITE COUNT
  // ======================================================

  const favoriteCount = favorites.length;

  // ======================================================
  // FILTER + SORT
  // ======================================================

  const filteredRestaurants = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    let result = restaurantsData.filter(
      (restaurant) => {
        const matchesCategory =
          activeCategory === "All" ||
          restaurant.category === activeCategory;

        const matchesSearch =
          restaurant.name
            .toLowerCase()
            .includes(searchText) ||
          restaurant.cuisine
            .toLowerCase()
            .includes(searchText) ||
          restaurant.category
            .toLowerCase()
            .includes(searchText);

        const matchesOpen = onlyOpen
          ? restaurant.isOpen
          : true;

        const matchesOffer = onlyOffers
          ? Boolean(restaurant.offer)
          : true;

        return (
          matchesCategory &&
          matchesSearch &&
          matchesOpen &&
          matchesOffer
        );
      }
    );

    if (sortBy === "Rating") {
      result = [...result].sort(
        (a, b) => b.rating - a.rating
      );
    }

    if (sortBy === "Delivery Time") {
      result = [...result].sort(
        (a, b) =>
          parseInt(a.deliveryTime, 10) -
          parseInt(b.deliveryTime, 10)
      );
    }

    if (sortBy === "Price Low") {
      result = [...result].sort(
        (a, b) =>
          a.priceForTwo -
          b.priceForTwo
      );
    }

    if (sortBy === "Price High") {
      result = [...result].sort(
        (a, b) =>
          b.priceForTwo -
          a.priceForTwo
      );
    }

    if (sortBy === "Popular") {
      result = [...result].sort(
        (a, b) =>
          Number(b.popular) -
          Number(a.popular)
      );
    }

    return result;
  }, [
    search,
    activeCategory,
    sortBy,
    onlyOpen,
    onlyOffers,
  ]);

  // ======================================================
  // TOGGLE FAVORITE
  // ======================================================

  const toggleFavorite = (restaurantId) => {
    const currentFavorites =
      getFavoriteRestaurants();

    const isAlreadyFavorite =
      currentFavorites.includes(restaurantId);

    let updatedFavorites;

    if (isAlreadyFavorite) {
      updatedFavorites =
        currentFavorites.filter(
          (id) => id !== restaurantId
        );
    } else {
      updatedFavorites = [
        ...currentFavorites,
        restaurantId,
      ];
    }

    setFavorites(updatedFavorites);

    saveFavoriteRestaurants(
      updatedFavorites
    );
  };

  // ======================================================
  // CHECK FAVORITE
  // ======================================================

  const isRestaurantFavorite = (restaurantId) => {
    return favorites.includes(restaurantId);
  };

  // ======================================================
  // ADD TO CART
  // ======================================================

  const addToCart = (restaurant) => {
    try {
      const oldCart = getCartItems();

      const cartItemId =
        `restaurant-${restaurant.id}`;

      const existingItem =
        oldCart.find(
          (item) =>
            item.id === cartItemId
        );

      let updatedCart;

      if (existingItem) {
        updatedCart = oldCart.map(
          (item) =>
            item.id === cartItemId
              ? {
                  ...item,
                  quantity:
                    Number(
                      item.quantity || 1
                    ) + 1,
                }
              : item
        );
      } else {
        updatedCart = [
          ...oldCart,
          {
            id: cartItemId,

            restaurantId:
              restaurant.id,

            name:
              `${restaurant.name} Special`,

            price:
              Number(
                restaurant.priceForTwo
              ),

            image:
              restaurant.image,

            quantity: 1,

            restaurant:
              restaurant.name,
          },
        ];
      }

      localStorage.setItem(
        CART_KEY,
        JSON.stringify(updatedCart)
      );

      const newCount =
        updatedCart.reduce(
          (total, item) =>
            total +
            Number(item.quantity || 1),
          0
        );

      setCartCount(newCount);

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );
    }
  };

  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("Recommended");
    setOnlyOpen(false);
    setOnlyOffers(false);
  };

  // ======================================================
  // GO TO WISHLIST
  // ======================================================

  const openWishlist = () => {
    navigate("/wishlist");
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <section className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-500">
            <MapPin size={18} />

            <span>
              Restaurants near you
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Discover Great Food
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Explore the best restaurants
                around you and order your
                favorite meals with fast
                doorstep delivery.
              </p>
            </div>

            {/* HEADER ACTIONS */}

            <div className="flex flex-wrap gap-3">

              {/* WISHLIST */}

              <button
                type="button"
                onClick={openWishlist}
                aria-label="Open wishlist"
                className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <Heart
                  size={19}
                  className={
                    favoriteCount > 0
                      ? "fill-red-500 text-red-500"
                      : ""
                  }
                />

                Wishlist

                {favoriteCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white">
                    {favoriteCount}
                  </span>
                )}
              </button>

              {/* CART */}

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                className="relative flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-orange-500"
              >
                <ShoppingBag size={19} />

                Cart

                {cartCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-black">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={21}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search restaurants, cuisines..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-10 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (prev) => !prev
                )
              }
              className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-bold transition ${
                showFilters
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
              }`}
            >
              <SlidersHorizontal size={18} />

              Filters
            </button>
          </div>

          {/* FILTER PANEL */}

          {showFilters && (
            <div className="mt-4 border-t border-slate-100 pt-4">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setOnlyOpen(
                        (prev) => !prev
                      )
                    }
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      onlyOpen
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {onlyOpen
                      ? "✓ Open Only"
                      : "Open Restaurants"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setOnlyOffers(
                        (prev) => !prev
                      )
                    }
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      onlyOffers
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {onlyOffers
                      ? "✓ Offers Only"
                      : "Offers"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-bold text-orange-500 hover:text-orange-600"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================
            CATEGORIES
        ================================================== */}

        <div className="mb-8 overflow-x-auto pb-2">

          <div className="flex min-w-max gap-3">

            {categories.map(
              (category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                    activeCategory ===
                    category
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-500"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* ==================================================
            RESULT HEADER
        ================================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-2xl font-black text-slate-900">
                {activeCategory ===
                "All"
                  ? "Popular Restaurants"
                  : `${activeCategory} Restaurants`}
              </h2>

              <Sparkles
                size={20}
                className="text-orange-500"
              />
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {filteredRestaurants.length}{" "}
              restaurants found
            </p>
          </div>

          {/* SORT */}

          <div className="relative w-full sm:w-auto">

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 sm:w-52"
            >
              <option value="Recommended">
                Recommended
              </option>

              <option value="Popular">
                Popular
              </option>

              <option value="Rating">
                Top Rated
              </option>

              <option value="Delivery Time">
                Fast Delivery
              </option>

              <option value="Price Low">
                Price: Low to High
              </option>

              <option value="Price High">
                Price: High to Low
              </option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* ==================================================
            RESTAURANT GRID
        ================================================== */}

        {filteredRestaurants.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredRestaurants.map(
              (restaurant) => {

                const isFavorite =
                  isRestaurantFavorite(
                    restaurant.id
                  );

                return (
                  <article
                    key={restaurant.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >

                    {/* IMAGE */}

                    <div className="relative h-56 overflow-hidden">

                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        loading="lazy"
                        className={`h-full w-full object-cover transition duration-700 group-hover:scale-110 ${
                          !restaurant.isOpen
                            ? "grayscale"
                            : ""
                        }`}
                      />

                      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                      {/* OFFER */}

                      {restaurant.offer && (
                        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
                          <Sparkles size={13} />

                          {restaurant.offer}
                        </div>
                      )}

                      {/* FAVORITE */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleFavorite(
                            restaurant.id
                          )
                        }
                        aria-label={
                          isFavorite
                            ? `Remove ${restaurant.name} from wishlist`
                            : `Add ${restaurant.name} to wishlist`
                        }
                        aria-pressed={
                          isFavorite
                        }
                        title={
                          isFavorite
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur transition hover:scale-110 ${
                          isFavorite
                            ? "bg-red-50"
                            : "bg-white/95"
                        }`}
                      >
                        <Heart
                          size={19}
                          className={
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-slate-600"
                          }
                        />
                      </button>

                      {/* OPEN STATUS */}

                      <div className="absolute bottom-4 left-4">

                        {restaurant.isOpen ? (
                          <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                            <CheckCircle2
                              size={16}
                              className="text-green-400"
                            />

                            Open now
                          </span>
                        ) : (
                          <span className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-bold text-white">
                            Currently closed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                      <div className="mb-2 flex items-start justify-between gap-3">

                        <h3 className="text-xl font-black text-slate-900 transition group-hover:text-orange-500">
                          {restaurant.name}
                        </h3>

                        <div className="flex shrink-0 items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-black text-white">
                          <Star
                            size={12}
                            className="fill-white"
                          />

                          {restaurant.rating}
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-1 text-sm font-medium text-slate-500">
                        {restaurant.cuisine}
                      </p>

                      {/* INFO */}

                      <div className="mb-4 flex flex-wrap gap-4 text-sm font-medium text-slate-500">

                        <div className="flex items-center gap-1.5">
                          <Clock3
                            size={16}
                            className="text-orange-500"
                          />

                          {restaurant.deliveryTime}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin
                            size={16}
                            className="text-orange-500"
                          />

                          {restaurant.distance}
                        </div>
                      </div>

                      <div className="mb-5 flex items-center justify-between border-t border-slate-100 pt-4">

                        <span className="text-sm font-bold text-slate-700">
                          ₹
                          {
                            restaurant.priceForTwo
                          }{" "}
                          for two
                        </span>

                        <span className="text-xs text-slate-400">
                          {restaurant.reviews.toLocaleString()}
                          + ratings
                        </span>
                      </div>

                      {/* ACTIONS */}

                      <div className="grid grid-cols-2 gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/restaurant/${restaurant.id}`
                            )
                          }
                          className="rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-black text-orange-600 transition hover:bg-orange-100"
                        >
                          View Menu
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart(
                              restaurant
                            )
                          }
                          disabled={
                            !restaurant.isOpen
                          }
                          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black text-white transition ${
                            restaurant.isOpen
                              ? "bg-orange-500 shadow-md shadow-orange-200 hover:bg-orange-600 hover:shadow-lg"
                              : "cursor-not-allowed bg-slate-300"
                          }`}
                        >
                          <Plus size={17} />

                          {restaurant.isOpen
                            ? "Add"
                            : "Closed"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        ) : (

          // ==================================================
          // EMPTY STATE
          // ==================================================

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <Search
                size={32}
                className="text-orange-500"
              />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              No restaurants found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any
              restaurant matching your
              search or filters. Try another
              restaurant, cuisine or
              category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-black text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
            >
              Clear Search & Filters
            </button>
          </div>
        )}

        {/* ==================================================
            BOTTOM CTA
        ================================================== */}

        <div className="mt-12 overflow-hidden rounded-3xl bg-linear-to-r from-orange-500 via-orange-500 to-amber-500 p-8 text-white shadow-xl sm:p-10">

          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

            <div>

              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-orange-100">
                <Sparkles size={17} />

                Fresh food. Fast delivery.
              </div>

              <h2 className="text-2xl font-black sm:text-3xl">
                Hungry? Your food is waiting! 🍕
              </h2>

              <p className="mt-2 max-w-xl text-sm text-orange-100 sm:text-base">
                Explore amazing restaurants
                and get your favorite meals
                delivered straight to your
                doorstep.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-white px-6 py-3 font-black text-orange-600 shadow-lg transition hover:bg-orange-50"
            >
              Explore Restaurants
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Restaurant;
