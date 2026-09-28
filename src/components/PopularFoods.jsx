import { useEffect, useState } from "react";
import { ShoppingCart, Check } from "lucide-react";

function PopularFoods() {
  const foods = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 299,
      rating: 5,
      restaurant: "Pizza Hut",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    },
    {
      id: 2,
      name: "Cheese Burger",
      price: 199,
      rating: 4.8,
      restaurant: "Burger King",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxSv76_3d4__bXrCFLvkIdkPVCuFVB0q3pSsvkLJSaQ&s=10",
    },
    {
      id: 3,
      name: "Veg Biryani",
      price: 249,
      rating: 4.9,
      restaurant: "Biryani House",
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600",
    },
    {
      id: 4,
      name: "Masala Dosa",
      price: 179,
      rating: 4.7,
      restaurant: "South Express",
      image:
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600",
    },
    {
      id: 5,
      name: "Paneer Tikka",
      price: 279,
      rating: 4.9,
      restaurant: "Punjab Grill",
      image:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600",
    },
    {
      id: 6,
      name: "Cold Coffee",
      price: 149,
      rating: 4.6,
      restaurant: "Cafe Coffee Day",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
    },
  ];

  const [cartCount, setCartCount] = useState(0);
  const [addedId, setAddedId] = useState(null);

  // ==========================================
  // CART COUNT
  // ==========================================

  const updateCartCount = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cartItems")
      );

      const cart = Array.isArray(savedCart)
        ? savedCart
        : [];

      const count = cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 1),
        0
      );

      setCartCount(count);
    } catch (error) {
      console.error("Cart count error:", error);
      setCartCount(0);
    }
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (food) => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cartItems")
      );

      const cart = Array.isArray(savedCart)
        ? savedCart
        : [];

      const existingItem = cart.find(
        (item) => item.id === food.id
      );

      let updatedCart;

      // Item already exists
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 1) + 1,
              }
            : item
        );
      }

      // New item
      else {
        updatedCart = [
          ...cart,
          {
            id: food.id,
            name: food.name,
            price: Number(food.price || 0),
            image: food.image || "",
            quantity: 1,
            restaurant: food.restaurant,
            rating: food.rating,
          },
        ];
      }

      // Save cart
      localStorage.setItem(
        "cartItems",
        JSON.stringify(updatedCart)
      );

      // Update all components
      window.dispatchEvent(
        new Event("cartUpdated")
      );

      // Update this component
      updateCartCount();

      // Button feedback
      setAddedId(food.id);

      setTimeout(() => {
        setAddedId(null);
      }, 1200);

    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );
    }
  };

  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-5">

        {/* ================= HEADER ================= */}

        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-500">
              Delicious & Fresh
            </p>

            <h2 className="text-4xl font-black text-gray-900">
              Popular Foods
            </h2>
          </div>

          {/* CART COUNT */}

          <div className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-gray-700 shadow-md">
            <ShoppingCart
              size={20}
              className="text-orange-500"
            />

            Cart: {cartCount}
          </div>
        </div>

        {/* ================= FOOD GRID ================= */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {foods.map((food) => (
            <div
              key={food.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              {/* IMAGE */}

              <div className="relative overflow-hidden">

                <img
                  src={food.image}
                  alt={food.name}
                  className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* RATING */}

                <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-yellow-600 shadow-md">
                  ⭐ {food.rating}
                </div>

              </div>

              {/* CONTENT */}

              <div className="p-5">

                <h3 className="text-2xl font-black text-gray-900">
                  {food.name}
                </h3>

                <p className="mt-1 text-gray-500">
                  {food.restaurant}
                </p>

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-2xl font-black text-orange-500">
                    ₹{food.price}
                  </span>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500">
                    Fresh Food
                  </span>

                </div>

                {/* ADD TO CART */}

                <button
                  type="button"
                  onClick={() => addToCart(food)}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition duration-300 ${
                    addedId === food.id
                      ? "bg-green-500"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {addedId === food.id ? (
                    <>
                      <Check size={20} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default PopularFoods;