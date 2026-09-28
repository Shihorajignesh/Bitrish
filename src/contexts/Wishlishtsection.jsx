import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";

// Same restaurant data
const restaurantsData = [
  {
    id: 1,
    name: "Pizza Palace",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
    cuisine: "Pizza, Italian, Fast Food",
    rating: 4.8,
    reviews: 1240,
    deliveryTime: "25-30 min",
    priceForTwo: 450,
    offer: "50% OFF",
    distance: "1.2 km",
    isOpen: true,
  },

  {
    id: 2,
    name: "Burger House",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    cuisine: "Burgers, American, Fast Food",
    rating: 4.7,
    reviews: 980,
    deliveryTime: "20-25 min",
    priceForTwo: 350,
    offer: "40% OFF",
    distance: "0.8 km",
    isOpen: true,
  },

  {
    id: 3,
    name: "Spice Garden",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
    cuisine: "Indian, Gujarati, Thali",
    rating: 4.6,
    reviews: 760,
    deliveryTime: "30-35 min",
    priceForTwo: 500,
    offer: "20% OFF",
    distance: "2.1 km",
    isOpen: true,
  },

  {
    id: 4,
    name: "Dragon Bowl",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    cuisine: "Chinese, Asian, Noodles",
    rating: 4.5,
    reviews: 620,
    deliveryTime: "25-30 min",
    priceForTwo: 400,
    offer: "30% OFF",
    distance: "1.7 km",
    isOpen: true,
  },

  {
    id: 5,
    name: "Sweet Heaven",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
    cuisine: "Desserts, Cakes, Ice Cream",
    rating: 4.9,
    reviews: 1500,
    deliveryTime: "15-20 min",
    priceForTwo: 300,
    offer: "25% OFF",
    distance: "1.0 km",
    isOpen: true,
  },

  {
    id: 6,
    name: "South Spice",
    image:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=80",
    cuisine: "South Indian, Dosa, Idli",
    rating: 4.4,
    reviews: 540,
    deliveryTime: "20-30 min",
    priceForTwo: 280,
    offer: "15% OFF",
    distance: "2.5 km",
    isOpen: true,
  },

  {
    id: 7,
    name: "Royal Thali",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    cuisine: "Gujarati, Indian, Thali",
    rating: 4.7,
    reviews: 890,
    deliveryTime: "25-30 min",
    priceForTwo: 420,
    offer: "35% OFF",
    distance: "1.5 km",
    isOpen: true,
  },

  {
    id: 8,
    name: "Pasta Corner",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
    cuisine: "Pasta, Italian, Continental",
    rating: 4.5,
    reviews: 430,
    deliveryTime: "30-35 min",
    priceForTwo: 550,
    offer: "25% OFF",
    distance: "2.8 km",
    isOpen: false,
  },
];

const FAVORITES_KEY = "favoriteRestaurants";

function Wishlist() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);

  // Load wishlist
  useEffect(() => {
    loadFavorites();
  }, []);

  // Listen for changes
  useEffect(() => {
    const updateFavorites = () => {
      loadFavorites();
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

  const loadFavorites = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(FAVORITES_KEY)
      );

      if (!Array.isArray(saved)) {
        setFavorites([]);
        return;
      }

      const favoriteIds = saved
        .map(Number)
        .filter((id) => Number.isFinite(id));

      const favoriteRestaurants =
        restaurantsData.filter((restaurant) =>
          favoriteIds.includes(restaurant.id)
        );

      setFavorites(favoriteRestaurants);
    } catch (error) {
      console.error(
        "Wishlist loading error:",
        error
      );

      setFavorites([]);
    }
  };

  // Remove item
  const removeFromWishlist = (restaurantId) => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(FAVORITES_KEY)
      );

      const currentIds = Array.isArray(saved)
        ? saved.map(Number)
        : [];

      const updatedIds = currentIds.filter(
        (id) => id !== restaurantId
      );

      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedIds)
      );

      setFavorites((prev) =>
        prev.filter(
          (restaurant) =>
            restaurant.id !== restaurantId
        )
      );

      window.dispatchEvent(
        new CustomEvent("favoritesUpdated", {
          detail: {
            favorites: updatedIds,
          },
        })
      );
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Heart
                size={25}
                className="fill-red-500 text-red-500"
              />

              <h1 className="text-3xl font-black text-slate-900">
                My Wishlist
              </h1>
            </div>

            <p className="text-sm text-slate-500">
              {favorites.length}{" "}
              {favorites.length === 1
                ? "restaurant"
                : "restaurants"}{" "}
              saved
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/restaurants")}
            className="rounded-xl bg-orange-500 px-5 py-3 font-black text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
          >
            Explore Restaurants
          </button>
        </div>

        {/* Empty */}

        {favorites.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <Heart
                size={35}
                className="text-red-400"
              />
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't added any restaurants
              to your wishlist yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-black text-white transition hover:bg-orange-600"
            >
              Find Restaurants
            </button>
          </div>
        ) : (
          /* Wishlist Grid */

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {favorites.map((restaurant) => (
              <article
                key={restaurant.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Image */}

                <div className="relative h-52 overflow-hidden">

                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                  {/* Remove */}

                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist(
                        restaurant.id
                      )
                    }
                    aria-label={`Remove ${restaurant.name} from wishlist`}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-red-50"
                  >
                    <Heart
                      size={19}
                      className="fill-red-500 text-red-500"
                    />
                  </button>

                  {restaurant.offer && (
                    <span className="absolute bottom-4 left-4 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-black text-white">
                      {restaurant.offer}
                    </span>
                  )}
                </div>

                {/* Content */}

                <div className="p-5">

                  <div className="mb-2 flex items-start justify-between gap-3">

                    <h2 className="text-xl font-black text-slate-900">
                      {restaurant.name}
                    </h2>

                    <span className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-black text-white">
                      ⭐ {restaurant.rating}
                    </span>
                  </div>

                  <p className="mb-4 text-sm text-slate-500">
                    {restaurant.cuisine}
                  </p>

                  <div className="mb-5 flex justify-between text-sm text-slate-500">
                    <span>
                      🕐 {restaurant.deliveryTime}
                    </span>

                    <span>
                      📍 {restaurant.distance}
                    </span>
                  </div>

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
                        removeFromWishlist(
                          restaurant.id
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-black text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>

                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Wishlist;
