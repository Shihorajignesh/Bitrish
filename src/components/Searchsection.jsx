import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search as SearchIcon,
  MapPin,
  Star,
  Clock3,
  ShoppingBag,
  Store,
  X,
  Heart,
  ShoppingCart,
  Eye,
  Check,
  Plus,
} from "lucide-react";

import { useSearch } from "../contexts/SearchContext";


// FOOD DATA


const foods = [
  {
    id: 1,
    name: "Margherita Pizza",
    restaurant: "Domino's Pizza",
    category: "Pizza",
    price: 249,
    rating: 4.7,
    time: "25 min",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
  },
  {
    id: 2,
    name: "Cheese Burger",
    restaurant: "Burger King",
    category: "Burger",
    price: 199,
    rating: 4.5,
    time: "20 min",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
  },
  {
    id: 3,
    name: "Pepperoni Pizza",
    restaurant: "Domino's Pizza",
    category: "Pizza",
    price: 349,
    rating: 4.8,
    time: "30 min",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
  },
  {
    id: 4,
    name: "Classic Veg Burger",
    restaurant: "Burger House",
    category: "Burger",
    price: 149,
    rating: 4.4,
    time: "18 min",
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800",
  },
  {
    id: 5,
    name: "Farmhouse Pizza",
    restaurant: "Domino's Pizza",
    category: "Pizza",
    price: 299,
    rating: 4.6,
    time: "28 min",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
  },
  {
    id: 6,
    name: "Veggie Burger",
    restaurant: "Burger King",
    category: "Burger",
    price: 179,
    rating: 4.3,
    time: "22 min",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
  },
  {
    id: 7,
    name: "Paneer Tikka",
    restaurant: "Spice Garden",
    category: "Indian",
    price: 229,
    rating: 4.6,
    time: "25 min",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
  },
  {
    id: 8,
    name: "Veg Biryani",
    restaurant: "Biryani House",
    category: "Biryani",
    price: 189,
    rating: 4.5,
    time: "30 min",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
  },
];


// RESTAURANT DATA


const restaurants = [
  {
    id: 1,
    name: "Domino's Pizza",
    cuisine: "Pizza, Italian, Fast Food",
    rating: 4.6,
    time: "25-30 min",
    location: "Near City Center",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800",
  },
  {
    id: 2,
    name: "Burger King",
    cuisine: "Burger, Fast Food",
    rating: 4.5,
    time: "20-25 min",
    location: "Main Road",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
  },
  {
    id: 3,
    name: "Pizza Hut",
    cuisine: "Pizza, Italian",
    rating: 4.4,
    time: "30-35 min",
    location: "Ring Road",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
  },
  {
    id: 4,
    name: "Spice Garden",
    cuisine: "Indian, Punjabi, Chinese",
    rating: 4.6,
    time: "25-30 min",
    location: "City Center",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800",
  },
];

// QUICK SEARCH


const quickSearches = [
  "Pizza",
  "Burger",
  "Dominos",
  "Biryani",
  "Indian",
];

// COMPONENT


function Searchsection() {
  const navigate = useNavigate();

  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
  } = useSearch();

  const [activeTab, setActiveTab] = useState("Foods");

  const [message, setMessage] = useState("");

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];
    } catch {
      return [];
    }
  });

  const search = searchQuery?.trim() || "";


  // TOAST MESSAGE
 

  const showMessage = (text) => {
    setMessage(text);
  };

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [message]);

  // SEARCH FOOD
  

  const filteredFoods = useMemo(() => {
    const value = search.toLowerCase();

    if (!value) {
      return foods;
    }

    return foods.filter((food) => {
      return (
        food.name.toLowerCase().includes(value) ||
        food.restaurant.toLowerCase().includes(value) ||
        food.category.toLowerCase().includes(value)
      );
    });
  }, [search]);

  // SEARCH RESTAURANTS
 

  const filteredRestaurants = useMemo(() => {
    const value = search.toLowerCase();

    if (!value) {
      return restaurants;
    }

    return restaurants.filter((restaurant) => {
      return (
        restaurant.name
          .toLowerCase()
          .includes(value) ||
        restaurant.cuisine
          .toLowerCase()
          .includes(value) ||
        restaurant.location
          .toLowerCase()
          .includes(value)
      );
    });
  }, [search]);

 
  // ADD FOOD TO CART
 

  const addToCart = (food) => {
    try {
      const savedCart =
        localStorage.getItem("cartItems");

      const cart = savedCart
        ? JSON.parse(savedCart)
        : [];

      const cartId = `food-${food.id}`;

      const existingItem = cart.find(
        (item) => item.id === cartId
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === cartId
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 1) + 1,
              }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            id: cartId,
            foodId: food.id,
            name: food.name,
            restaurant: food.restaurant,
            category: food.category,
            price: Number(food.price),
            quantity: 1,
            image: food.image,
            rating: food.rating,
          },
        ];
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(updatedCart)
      );

      // Update Navbar / Cart component
      window.dispatchEvent(
        new Event("cartUpdated")
      );

      showMessage(
        `${food.name} added to cart 🛒`
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      showMessage(
        "Unable to add item to cart."
      );
    }
  };

  // WISHLIST
 

  const toggleWishlist = (food) => {
    try {
      const exists = wishlist.some(
        (item) => item.id === food.id
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = wishlist.filter(
          (item) => item.id !== food.id
        );

        showMessage(
          `${food.name} removed from wishlist`
        );
      } else {
        updatedWishlist = [
          ...wishlist,
          food,
        ];

        showMessage(
          `${food.name} added to wishlist `
        );
      }

      setWishlist(updatedWishlist);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      showMessage(
        "Wishlist update failed."
      );
    }
  };

  // CHECK WISHLIST
 

  const isWishlisted = (id) => {
    return wishlist.some(
      (item) => item.id === id
    );
  };


  // QUICK SEARCH
 

  const handleSuggestion = (value) => {
    setSearchQuery(value);
    setActiveTab("Foods");
  };

  // ====================================================
  // SEARCH SUBMIT
  // ====================================================

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search) {
      showMessage(
        "Please enter something to search."
      );
      return;
    }

    showMessage(
      `Searching for "${search}"`
    );
  };

  
  // CLEAR SEARCH
 

  const handleClearSearch = () => {
    clearSearch();
    setActiveTab("Foods");
  };

  // VIEW RESTAURANT
 

  const handleRestaurant = (restaurant) => {
    navigate("/restaurant", {
      state: {
        restaurant,
      },
    });
  };

 
  // RENDER
 

  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-16">

      {/* 
          TOAST
       */}

      {message && (
        <div className="fixed right-4 top-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          <Check
            size={18}
            className="shrink-0 text-green-400"
          />

          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            className="ml-2 rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* 
          HERO
       */}

      <section className="relative overflow-hidden bg-linear-to-br from-orange-500 via-orange-600 to-red-600 px-4 py-16 sm:py-20">

        {/* Background decoration */}

        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white backdrop-blur-md">
             Find Your Favourite Food
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Search Anything
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-orange-100 sm:text-base">
            Search your favourite food,
            restaurants, cuisines, pizzas,
            burgers and much more.
          </p>

          {/* SEARCH FORM */}

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row sm:items-center"
          >
            <div className="relative flex flex-1 items-center">

              <SearchIcon
                size={23}
                className="ml-4 shrink-0 text-slate-400"
              />

              <input
                type="text"
                value={searchQuery || ""}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search pizza, burger, Domino's..."
                className="w-full bg-transparent px-4 py-4 text-base font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:text-lg"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mr-2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-7 py-4 font-black text-white shadow-lg transition hover:bg-orange-600 active:scale-95"
            >
              Search
            </button>
          </form>

          {/* QUICK SEARCH */}

          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
            {quickSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  handleSuggestion(item)
                }
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-orange-600"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 
          RESULTS
       */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* RESULT HEADER */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-xs font-black uppercase tracking-[3px] text-orange-500">
              Search Results
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              {search
                ? `Results for "${search}"`
                : "Popular Results"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {activeTab === "Foods"
                ? `${filteredFoods.length} foods found`
                : `${filteredRestaurants.length} restaurants found`}
            </p>
          </div>

          {/* TABS */}

          <div className="flex w-full rounded-xl bg-white p-1 shadow-md md:w-auto">

            <button
              type="button"
              onClick={() =>
                setActiveTab("Foods")
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition md:flex-none ${
                activeTab === "Foods"
                  ? "bg-orange-500 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ShoppingBag size={18} />
              Foods
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("Restaurants")
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition md:flex-none ${
                activeTab === "Restaurants"
                  ? "bg-orange-500 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Store size={18} />
              Restaurants
            </button>

          </div>
        </div>

        {/* ==================================================
            FOOD RESULTS
        ================================================== */}

        {activeTab === "Foods" && (
          <>
            {filteredFoods.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {filteredFoods.map((food) => {
                  const liked = isWishlisted(
                    food.id
                  );

                  return (
                    <article
                      key={food.id}
                      className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    >

                      {/* IMAGE */}

                      <div className="relative h-52 overflow-hidden">

                        <img
                          src={food.image}
                          alt={food.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent" />

                        {/* CATEGORY */}

                        <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-black text-orange-600 shadow-lg">
                          {food.category}
                        </div>

                        {/* WISHLIST */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleWishlist(food)
                          }
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
                          aria-label="Toggle wishlist"
                        >
                          <Heart
                            size={19}
                            className={
                              liked
                                ? "fill-red-500 text-red-500"
                                : "text-slate-600"
                            }
                          />
                        </button>

                        {/* RATING */}

                        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-black text-white">
                          <Star
                            size={13}
                            fill="currentColor"
                          />
                          {food.rating}
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="p-5">

                        <h3 className="truncate text-lg font-black text-slate-900">
                          {food.name}
                        </h3>

                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                          <Store size={14} />
                          {food.restaurant}
                        </p>

                        <div className="mt-4 flex items-center justify-between">

                          <span className="text-xl font-black text-orange-600">
                            ₹{food.price}
                          </span>

                          <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                            <Clock3 size={15} />
                            {food.time}
                          </span>

                        </div>

                        {/* VIEW DETAILS */}

                        <Link
                          to="/food-details"
                          state={{ food }}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-black text-orange-600 transition hover:bg-orange-100"
                        >
                          <Eye size={17} />
                          View Details
                        </Link>

                        {/* ADD CART */}

                        <button
                          type="button"
                          onClick={() =>
                            addToCart(food)
                          }
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-black text-white shadow-md shadow-orange-100 transition hover:bg-orange-600 active:scale-[0.98]"
                        >
                          <ShoppingCart
                            size={17}
                          />
                          Add to Cart
                        </button>

                      </div>
                    </article>
                  );
                })}

              </div>
            ) : (
              <EmptyState
                search={search}
                onClear={handleClearSearch}
              />
            )}
          </>
        )}

        {/* 
            RESTAURANT RESULTS
      */}

        {activeTab === "Restaurants" && (
          <>
            {filteredRestaurants.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {filteredRestaurants.map(
                  (restaurant) => (
                    <article
                      key={restaurant.id}
                      className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    >

                      {/* IMAGE */}

                      <div className="relative h-56 overflow-hidden">

                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/70 to-transparent" />

                        {/* RATING */}

                        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-black text-white shadow-lg">
                          <Star
                            size={14}
                            fill="currentColor"
                          />
                          {restaurant.rating}
                        </div>

                        {/* LOCATION */}

                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-sm font-bold text-white">
                          <MapPin size={16} />
                          {restaurant.location}
                        </div>

                      </div>

                      {/* CONTENT */}

                      <div className="p-6">

                        <h3 className="text-xl font-black text-slate-900 transition group-hover:text-orange-500">
                          {restaurant.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {restaurant.cuisine}
                        </p>

                        <div className="mt-4 space-y-2 text-sm font-medium text-slate-600">

                          <div className="flex items-center gap-2">
                            <Clock3
                              size={17}
                              className="text-orange-500"
                            />
                            {restaurant.time}
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin
                              size={17}
                              className="text-orange-500"
                            />
                            {restaurant.location}
                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRestaurant(
                              restaurant
                            )
                          }
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-black text-white shadow-md shadow-orange-100 transition hover:bg-orange-600"
                        >
                          <Store size={18} />
                          View Restaurant
                        </button>

                      </div>
                    </article>
                  )
                )}

              </div>
            ) : (
              <EmptyState
                search={search}
                onClear={handleClearSearch}
              />
            )}
          </>
        )}

        {/* 
            BOTTOM CTA
        */}

        <div className="mt-12 overflow-hidden rounded-3xl bg-linear-to-r from-orange-500 via-orange-500 to-amber-500 p-7 text-white shadow-xl sm:p-10">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-bold text-orange-100">
                🍕 Fresh food. Fast delivery.
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Hungry? Let's find your food!
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-orange-100 sm:text-base">
                Search amazing foods and restaurants
                and order your favourite meal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                handleClearSearch();
                setActiveTab("Foods");
              }}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-black text-orange-600 shadow-lg transition hover:bg-orange-50"
            >
              <Plus size={18} />
              Explore Food
            </button>

          </div>
        </div>

      </section>
    </main>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({ search, onClear }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
        <SearchIcon
          size={34}
          className="text-orange-500"
        />
      </div>

      <h3 className="mt-6 text-2xl font-black text-slate-900">
        No Results Found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        We couldn't find anything for{" "}
        <span className="font-black text-orange-500">
          "{search || "your search"}"
        </span>
        . Try Pizza, Burger, Biryani or
        Indian food.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-md shadow-orange-100 transition hover:bg-orange-600"
      >
        Clear Search
      </button>

    </div>
  );
}

export default Searchsection;