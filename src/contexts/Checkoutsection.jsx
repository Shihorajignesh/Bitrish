import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  User,
  CreditCard,
  WalletCards,
  Banknote,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react";

// ======================================================
// STORAGE KEYS
// ======================================================

const CART_KEY = "cartItems";
const ORDERS_KEY = "orders";
const CURRENT_ORDER_KEY = "currentOrder";

// ======================================================
// ORDER SETTINGS
// ======================================================

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_LIMIT = 500;
const GST_RATE = 0.05;

// ======================================================
// HELPERS
// ======================================================

const formatPrice = (value) => {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(number);
};

const normalizeQuantity = (value) => {
  const quantity = Number(value);

  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }

  return Math.floor(quantity);
};

const normalizeCart = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item) =>
        item &&
        item.id !== undefined &&
        item.id !== null
    )
    .map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      quantity: normalizeQuantity(item.quantity),
    }));
};

// ======================================================
// READ CART
// ======================================================

const getCartFromStorage = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart = localStorage.getItem(CART_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return normalizeCart(parsedCart);
  } catch (error) {
    console.error(
      "Checkout cart loading error:",
      error
    );

    return [];
  }
};

// ======================================================
// SAVE CART
// ======================================================

const saveCartToStorage = (cart) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const normalizedCart = normalizeCart(cart);

    if (normalizedCart.length === 0) {
      localStorage.removeItem(CART_KEY);
    } else {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(normalizedCart)
      );
    }

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: {
          cart: normalizedCart,
        },
      })
    );
  } catch (error) {
    console.error(
      "Checkout cart save error:",
      error
    );
  }
};

// ======================================================
// COMPONENT
// ======================================================

function Checkout() {
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [cart, setCart] = useState([]);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ====================================================
  // LOAD CART
  // ====================================================

  const loadCart = useCallback(() => {
    const savedCart = getCartFromStorage();

    setCart(savedCart);
  }, []);

  useEffect(() => {
    loadCart();

    window.addEventListener(
      "cartUpdated",
      loadCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadCart
      );
    };
  }, [loadCart]);

  // ====================================================
  // TOTAL ITEMS
  // ====================================================

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => {
      return (
        total +
        normalizeQuantity(item.quantity)
      );
    }, 0);
  }, [cart]);

  // ====================================================
  // SUBTOTAL
  // ====================================================

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(item.price) || 0;

      const quantity =
        normalizeQuantity(item.quantity);

      return total + price * quantity;
    }, 0);
  }, [cart]);

  // ====================================================
  // DELIVERY
  // ====================================================

  const deliveryFee = useMemo(() => {
    if (subtotal <= 0) {
      return 0;
    }

    return subtotal >= FREE_DELIVERY_LIMIT
      ? 0
      : DELIVERY_CHARGE;
  }, [subtotal]);

  // ====================================================
  // GST
  // ====================================================

  const tax = useMemo(() => {
    return Math.round(
      subtotal * GST_RATE
    );
  }, [subtotal]);

  // ====================================================
  // GRAND TOTAL
  // ====================================================

  const total = useMemo(() => {
    return (
      subtotal +
      deliveryFee +
      tax
    );
  }, [
    subtotal,
    deliveryFee,
    tax,
  ]);

  // ====================================================
  // UPDATE QUANTITY
  // ====================================================

  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (
          String(item.id) !==
          String(id)
        ) {
          return item;
        }

        const currentQuantity =
          normalizeQuantity(
            item.quantity
          );

        const newQuantity =
          currentQuantity + change;

        return {
          ...item,
          quantity: newQuantity,
        };
      })
      .filter(
        (item) =>
          Number(item.quantity) > 0
      );

    setCart(updatedCart);

    saveCartToStorage(updatedCart);
  };

  // ====================================================
  // REMOVE ITEM
  // ====================================================

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) =>
        String(item.id) !==
        String(id)
    );

    setCart(updatedCart);

    saveCartToStorage(updatedCart);
  };

  // ====================================================
  // ADDRESS INPUT
  // ====================================================

  const handleAddressChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    let finalValue = value;

    // Only numbers for phone
    if (name === "phone") {
      finalValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    // Only numbers for pincode
    if (name === "pincode") {
      finalValue = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }

    setAddress((previous) => ({
      ...previous,
      [name]: finalValue,
    }));

    setError("");
  };

  // ====================================================
  // VALIDATE FORM
  // ====================================================

  const validateForm = () => {
    if (!cart.length) {
      setError(
        "Your cart is empty. Please add food items first."
      );

      return false;
    }

    if (!address.name.trim()) {
      setError(
        "Please enter your full name."
      );

      return false;
    }

    if (
      !/^[A-Za-z\s.'-]{2,}$/.test(
        address.name.trim()
      )
    ) {
      setError(
        "Please enter a valid name."
      );

      return false;
    }

    if (!address.phone.trim()) {
      setError(
        "Please enter your phone number."
      );

      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        address.phone
      )
    ) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return false;
    }

    if (!address.address.trim()) {
      setError(
        "Please enter your complete delivery address."
      );

      return false;
    }

    if (
      address.address.trim().length <
      10
    ) {
      setError(
        "Please enter a more complete delivery address."
      );

      return false;
    }

    if (!address.city.trim()) {
      setError(
        "Please enter your city."
      );

      return false;
    }

    if (!address.pincode.trim()) {
      setError(
        "Please enter your pincode."
      );

      return false;
    }

    if (
      !/^\d{6}$/.test(
        address.pincode
      )
    ) {
      setError(
        "Please enter a valid 6-digit pincode."
      );

      return false;
    }

    return true;
  };

  // ====================================================
  // PLACE ORDER
  // ====================================================

  const handlePlaceOrder = () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get latest cart
      const latestCart =
        getCartFromStorage();

      if (!latestCart.length) {
        setError(
          "Your cart is empty. Please add food items first."
        );

        setLoading(false);

        return;
      }

      // Recalculate totals from latest cart
      const latestSubtotal =
        latestCart.reduce(
          (sum, item) => {
            return (
              sum +
              Number(item.price || 0) *
                normalizeQuantity(
                  item.quantity
                )
            );
          },
          0
        );

      const latestDelivery =
        latestSubtotal >=
        FREE_DELIVERY_LIMIT
          ? 0
          : DELIVERY_CHARGE;

      const latestTax = Math.round(
        latestSubtotal * GST_RATE
      );

      const latestTotal =
        latestSubtotal +
        latestDelivery +
        latestTax;

      // Unique order ID
      const orderId =
        "BR-" +
        Date.now()
          .toString()
          .slice(-8);

      // New order
      const newOrder = {
        orderId,

        items: latestCart.map(
          (item) => ({
            ...item,
            quantity:
              normalizeQuantity(
                item.quantity
              ),
          })
        ),

        address: {
          name: address.name.trim(),
          phone: address.phone.trim(),
          address:
            address.address.trim(),
          city: address.city.trim(),
          pincode:
            address.pincode.trim(),
        },

        paymentMethod,

        subtotal:
          latestSubtotal,

        deliveryFee:
          latestDelivery,

        tax: latestTax,

        total: latestTotal,

        status: "Preparing",

        estimatedDelivery:
          "30-40 mins",

        createdAt:
          new Date().toISOString(),
      };

      // ==================================================
      // SAVE CURRENT ORDER
      // ==================================================

      localStorage.setItem(
        CURRENT_ORDER_KEY,
        JSON.stringify(newOrder)
      );

      // ==================================================
      // SAVE ALL ORDERS
      // ==================================================

      let existingOrders = [];

      try {
        const savedOrders =
          localStorage.getItem(
            ORDERS_KEY
          );

        if (savedOrders) {
          const parsedOrders =
            JSON.parse(
              savedOrders
            );

          if (
            Array.isArray(
              parsedOrders
            )
          ) {
            existingOrders =
              parsedOrders;
          }
        }
      } catch (orderError) {
        console.error(
          "Orders loading error:",
          orderError
        );
      }

      const updatedOrders = [
        newOrder,
        ...existingOrders,
      ];

      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(
          updatedOrders
        )
      );

      // ==================================================
      // CLEAR CART
      // ==================================================

      localStorage.removeItem(
        CART_KEY
      );

      setCart([]);

      window.dispatchEvent(
        new CustomEvent(
          "cartUpdated",
          {
            detail: {
              cart: [],
            },
          }
        )
      );

      window.dispatchEvent(
        new Event("ordersUpdated")
      );

      // ==================================================
      // GO SUCCESS PAGE
      // ==================================================

      navigate(
        "/order-success",
        {
          replace: true,
          state: {
            order: newOrder,
          },
        }
      );
    } catch (placeOrderError) {
      console.error(
        "Place order error:",
        placeOrderError
      );

      setError(
        "Something went wrong while placing your order. Please try again."
      );

      setLoading(false);
    }
  };

  // ====================================================
  // EMPTY CART
  // ====================================================

  if (!cart.length) {
    return (
      <section className="min-h-screen bg-linear-to-br from-orange-50 via-white to-slate-50 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-4xl border border-orange-100 bg-white p-8 text-center shadow-2xl sm:p-12">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-100">
              <ShoppingBag
                size={45}
                className="text-orange-500"
              />
            </div>

            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Your Cart is Empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Add some delicious food to
              your cart before going to
              checkout.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/restaurant"
                )
              }
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-red-500 px-7 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <ShoppingBag size={19} />
              Order Food
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ====================================================
  // MAIN CHECKOUT
  // ====================================================

  return (
    <section className="min-h-screen bg-linear-to-br from-orange-50 via-white to-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center gap-4">

          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
            aria-label="Back to cart"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-orange-50 hover:text-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <p className="text-xs font-black uppercase tracking-[2px] text-orange-500">
              BiteRush
            </p>

            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Checkout
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Complete your order and enjoy
              delicious food.
            </p>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600"
          >
            <span className="mt-0.5">
              ⚠️
            </span>

            <span>{error}</span>
          </div>
        )}

        {/* MAIN GRID */}

        <div className="grid gap-7 lg:grid-cols-[1fr_400px]">

          {/* LEFT */}

          <div className="space-y-7">

            {/* ADDRESS */}

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-7">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                  <MapPin
                    size={22}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Delivery Address
                  </h2>

                  <p className="text-xs text-slate-500">
                    Where should we deliver
                    your food?
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={
                        address.name
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={
                        address.phone
                      }
                      onChange={
                        handleAddressChange
                      }
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                {/* ADDRESS */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Complete Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    value={
                      address.address
                    }
                    onChange={
                      handleAddressChange
                    }
                    rows={3}
                    placeholder="House no, street, area, landmark..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    value={
                      address.city
                    }
                    onChange={
                      handleAddressChange
                    }
                    placeholder="Ahmedabad"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                {/* PINCODE */}

                <div>
                  <label
                    htmlFor="pincode"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={
                      address.pincode
                    }
                    onChange={
                      handleAddressChange
                    }
                    maxLength={6}
                    placeholder="380001"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-7">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <CreditCard
                    size={22}
                    className="text-blue-500"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Payment Method
                  </h2>

                  <p className="text-xs text-slate-500">
                    Choose how you want to
                    pay.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">

                {/* COD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "cod"
                    )
                  }
                  aria-pressed={
                    paymentMethod ===
                    "cod"
                  }
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod ===
                    "cod"
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <Banknote
                    size={25}
                    className={
                      paymentMethod ===
                      "cod"
                        ? "text-orange-500"
                        : "text-slate-400"
                    }
                  />

                  <p className="mt-3 font-black text-slate-900">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Pay when food arrives
                  </p>
                </button>

                {/* UPI */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "upi"
                    )
                  }
                  aria-pressed={
                    paymentMethod ===
                    "upi"
                  }
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod ===
                    "upi"
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <WalletCards
                    size={25}
                    className={
                      paymentMethod ===
                      "upi"
                        ? "text-orange-500"
                        : "text-slate-400"
                    }
                  />

                  <p className="mt-3 font-black text-slate-900">
                    UPI
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Google Pay / PhonePe
                  </p>
                </button>

                {/* CARD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "card"
                    )
                  }
                  aria-pressed={
                    paymentMethod ===
                    "card"
                  }
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod ===
                    "card"
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <CreditCard
                    size={25}
                    className={
                      paymentMethod ===
                      "card"
                        ? "text-orange-500"
                        : "text-slate-400"
                    }
                  />

                  <p className="mt-3 font-black text-slate-900">
                    Card
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Credit / Debit Card
                  </p>
                </button>
              </div>
            </div>

            {/* SECURITY */}

            <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={23}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <div>
                  <p className="font-black text-green-700">
                    Safe & Secure Checkout
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-600">
                    Your order information
                    is stored securely and
                    used only for delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-7">

              {/* HEADER */}

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {totalItems}{" "}
                    {totalItems ===
                    1
                      ? "item"
                      : "items"}
                  </p>
                </div>

                <ShoppingBag
                  size={23}
                  className="text-orange-500"
                />
              </div>

              {/* ITEMS */}

              <div className="mt-6 max-h-105 space-y-3 overflow-y-auto pr-1">
                {cart.map(
                  (
                    item,
                    index
                  ) => {
                    const quantity =
                      normalizeQuantity(
                        item.quantity
                      );

                    const price =
                      Number(
                        item.price
                      ) || 0;

                    return (
                      <div
                        key={
                          item.id ||
                          `${item.name}-${index}`
                        }
                        className="rounded-2xl bg-slate-50 p-3"
                      >
                        <div className="flex gap-3">

                          {/* IMAGE */}

                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name ||
                                "Food"
                              }
                              className="h-16 w-16 shrink-0 rounded-xl object-cover"
                              onError={(
                                event
                              ) => {
                                event.currentTarget.src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                              }}
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                              <ShoppingBag
                                size={
                                  22
                                }
                                className="text-orange-500"
                              />
                            </div>
                          )}

                          {/* INFO */}

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-black text-slate-900">
                              {item.name ||
                                "Food Item"}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              ₹
                              {formatPrice(
                                price
                              )}{" "}
                              ×{" "}
                              {
                                quantity
                              }
                            </p>

                            <div className="mt-2 flex items-center gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    -1
                                  )
                                }
                                aria-label={`Decrease ${item.name}`}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-orange-400 hover:text-orange-500"
                              >
                                <Minus
                                  size={
                                    13
                                  }
                                />
                              </button>

                              <span className="w-5 text-center text-xs font-black">
                                {
                                  quantity
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    1
                                  )
                                }
                                aria-label={`Increase ${item.name}`}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-orange-400 hover:text-orange-500"
                              >
                                <Plus
                                  size={
                                    13
                                  }
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(
                                    item.id
                                  )
                                }
                                aria-label={`Remove ${item.name}`}
                                className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2
                                  size={
                                    15
                                  }
                                />
                              </button>
                            </div>
                          </div>

                          {/* ITEM TOTAL */}

                          <strong className="shrink-0 text-sm font-black text-slate-900">
                            ₹
                            {formatPrice(
                              price *
                                quantity
                            )}
                          </strong>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* DELIVERY */}

              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-orange-50 p-4">
                <Clock3
                  size={21}
                  className="text-orange-500"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Estimated Delivery
                  </p>

                  <p className="font-black text-slate-900">
                    30-40 mins
                  </p>
                </div>
              </div>

              {/* PRICE */}

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-bold text-slate-900">
                    ₹
                    {formatPrice(
                      subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Delivery Fee
                  </span>

                  <span
                    className={
                      deliveryFee ===
                      0
                        ? "font-bold text-green-600"
                        : "font-bold text-slate-900"
                    }
                  >
                    {deliveryFee ===
                    0
                      ? "FREE"
                      : `₹${formatPrice(
                          deliveryFee
                        )}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    GST (5%)
                  </span>

                  <span className="font-bold text-slate-900">
                    ₹{formatPrice(tax)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-black text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-black text-orange-500">
                    ₹
                    {formatPrice(
                      total
                    )}
                  </span>
                </div>
              </div>

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={
                  handlePlaceOrder
                }
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-red-500 px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={19}
                    />

                    Place Order

                    <ArrowRight
                      size={19}
                    />
                  </>
                )}
              </button>

              {/* BACK */}

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 font-bold text-slate-500 transition hover:border-orange-400 hover:text-orange-500"
              >
                <ArrowLeft
                  size={17}
                />
                Back to Cart
              </button>

              <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
                By placing this order, you
                agree to BiteRush's order
                and delivery terms.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
