import React, { useEffect, useMemo, useState } from "react";

import {
  FaPizzaSlice,
  FaPlus,
  FaCheck,
  FaUtensils,
} from "react-icons/fa";

import { RiDrinks2Fill } from "react-icons/ri";
import { PiHamburgerFill } from "react-icons/pi";

import {
  MdOutlineFoodBank,
  MdRamenDining,
} from "react-icons/md";

import { TiSortAlphabetically } from "react-icons/ti";

import {
  GiNoodles,
  GiCakeSlice,
} from "react-icons/gi";


// CATEGORY DATA


const categories = [
  {
    id: 1,
    name: "All",
    icon: <TiSortAlphabetically />,
  },
  {
    id: 2,
    name: "Pizza",
    icon: <FaPizzaSlice />,
  },
  {
    id: 3,
    name: "Burger",
    icon: <PiHamburgerFill />,
  },
  {
    id: 4,
    name: "Chinese",
    icon: <GiNoodles />,
  },
  {
    id: 5,
    name: "Gujarati",
    icon: <MdOutlineFoodBank />,
  },
  {
    id: 6,
    name: "South Indian",
    icon: <MdRamenDining />,
  },
  {
    id: 7,
    name: "Dessert",
    icon: <GiCakeSlice />,
  },
  {
    id: 8,
    name: "Drinks",
    icon: <RiDrinks2Fill />,
  },
];

// FOOD DATA


const foods = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700",
  },

  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700",
  },

  {
    id: 3,
    name: "Cheese Burger",
    category: "Burger",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700",
  },

  {
    id: 4,
    name: "Veg Burger",
    category: "Burger",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=700",
  },

  {
    id: 5,
    name: "Hakka Noodles",
    category: "Chinese",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=700",
  },

  {
    id: 6,
    name: "Gujarati Thali",
    category: "Gujarati",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700",
  },

  {
    id: 7,
    name: "Masala Dosa",
    category: "South Indian",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=700",
  },

  {
    id: 8,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700",
  },

  {
    id: 9,
    name: "Cold Coffee",
    category: "Drinks",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700",
  },

  {
    id: 10,
    name: "Fresh Lemon Juice",
    category: "Drinks",
    price: 90,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS63DsRo0WaSRGVKpcWZ4ErhJ0yHRDa2Ffka2FEvLP0XQ&s=10",
  },
  {
    id: 11,
    name: "Paneer Tikka",
    category: "Chinese",
    price: 299,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQprE3HS9kHJVX0wv-FMn9FyGK31aNFactKhzB7_UqphA&s=10",
  },
  {
    id: 12,
    name: "Veggie Delight Pizza",
    category: "Pizza",
    price: 349,
    image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo66wcL7atKRYYwuQfgvn71rfNgtt4DbVJB4PS9qP2HA&s=10"
  }
];


// HELPER FUNCTIONS


const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN").format(price);
};

const getCartItems = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = localStorage.getItem("cartItems");

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Unable to read cart:", error);

    return [];
  }
};


// COMPONENT


function Categories() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [addedId, setAddedId] = useState(null);

 
  // FILTER FOOD
  

  const filteredFoods = useMemo(() => {
    if (selectedCategory === "All") {
      return foods;
    }

    return foods.filter(
      (food) => food.category === selectedCategory
    );
  }, [selectedCategory]);

  
  // CLEANUP ADD FEEDBACK
 

  useEffect(() => {
    if (addedId === null) {
      return;
    }

    const timer = setTimeout(() => {
      setAddedId(null);
    }, 1200);

    return () => clearTimeout(timer);
  }, [addedId]);

  
  // ADD TO CART
  

  const handleAddToCart = (food) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const existingCart = getCartItems();

      const existingItemIndex = existingCart.findIndex(
        (item) => Number(item.id) === Number(food.id)
      );

      let updatedCart;

      if (existingItemIndex !== -1) {
        updatedCart = existingCart.map((item, index) => {
          if (index !== existingItemIndex) {
            return item;
          }

          return {
            ...item,
            quantity: Math.max(
              1,
              Number(item.quantity) || 1
            ) + 1,
          };
        });
      } else {
        updatedCart = [
          ...existingCart,
          {
            ...food,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(updatedCart)
      );

      // Notify Navbar / Cart components
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            cart: updatedCart,
            addedItem: food,
          },
        })
      );

      // Button feedback
      setAddedId(food.id);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

 
  // RENDER
 

  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-gray-50 py-16 sm:py-20"
    >
     
          {/* BACKGROUND DECORATION */}
    

      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-yellow-200/30 blur-3xl"
        aria-hidden="true"
      />

      {/* 
          MAIN CONTAINER
     */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =================================================
            HEADING
        ================================================= */}

        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
            <FaUtensils aria-hidden="true" />
            Delicious Food
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Explore Our{" "}
            <span className="text-orange-500">
              Categories
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Discover your favorite meals, freshly prepared
            and delivered right to your doorstep.
          </p>
        </div>

        {/* =================================================
            CATEGORY BUTTONS
        ================================================= */}

        <div className="mb-10">
          <div
            className="flex gap-3 overflow-x-auto pb-4 sm:flex-wrap sm:justify-center"
            role="tablist"
            aria-label="Food categories"
          >
            {categories.map((category) => {
              const isActive =
                selectedCategory === category.name;

              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${category.name} foods`}
                  onClick={() =>
                    setSelectedCategory(category.name)
                  }
                  className={`group flex min-w-max items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                    isActive
                      ? "scale-105 bg-orange-500 text-white shadow-lg shadow-orange-200"
                      : "bg-white text-gray-700 shadow-sm hover:-translate-y-1 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  <span className="flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </span>

                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================
            FOOD HEADING
        ================================================= */}

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {selectedCategory === "All"
              ? "Popular Foods"
              : `${selectedCategory} Foods`}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {filteredFoods.length}{" "}
            {filteredFoods.length === 1
              ? "item"
              : "items"}{" "}
            available
          </p>
        </div>

        {/* =================================================
            FOOD GRID
        ================================================= */}

        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFoods.map((food) => (
              <article
                key={food.id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* =================================================
                    IMAGE
                ================================================= */}

                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={food.image}
                    alt={food.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700";
                    }}
                  />

                  {/* Image Overlay */}

                  <div
                    className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  {/* Category Badge */}

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-orange-500 shadow">
                      {food.category}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="p-5">
                  <h4
                    className="truncate text-lg font-bold text-gray-900"
                    title={food.name}
                  >
                    {food.name}
                  </h4>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xl font-extrabold text-orange-500">
                      ₹{formatPrice(food.price)}
                    </span>

                    <span className="text-xs font-medium text-gray-400">
                      Fresh & Tasty
                    </span>
                  </div>

                  {/* =================================================
                      ADD BUTTON
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(food)
                    }
                    aria-label={`Add ${food.name} to cart`}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                      addedId === food.id
                        ? "bg-green-500 shadow-green-200"
                        : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200"
                    }`}
                  >
                    {addedId === food.id ? (
                      <>
                        <FaCheck aria-hidden="true" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <FaPlus aria-hidden="true" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* =================================================
              EMPTY STATE
          ================================================= */

          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
              🍽️
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              No food found
            </h3>

            <p className="mt-2 text-gray-500">
              We don't have items in this category yet.
            </p>

            <button
              type="button"
              onClick={() =>
                setSelectedCategory("All")
              }
              className="mt-5 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              View All Foods
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
