import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  X,
  ShieldCheck,
  Truck,
  ReceiptText,
  Utensils,
  Tag,
} from "lucide-react";

// ======================================================
// CONSTANTS
// ======================================================

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_LIMIT = 500;
const GST_RATE = 0.05;

const CART_KEY = "cartItems";

// ======================================================
// OFFERS / COUPONS
// ======================================================

const OFFER_COUPONS = [
  {
    code: "FEST50",
    title: "Flat 50% OFF",
    description: "Get 50% off up to ₹150",
    type: "percentage",
    value: 50,
    maxDiscount: 150,
    minOrder: 399,
  },
  {
    code: "TODAY40",
    title: "₹40 OFF",
    description: "Save ₹40 on today's order",
    type: "flat",
    value: 40,
    minOrder: 299,
  },
  {
    code: "SAVE150",
    title: "₹150 OFF",
    description: "Big savings on orders above ₹699",
    type: "flat",
    value: 150,
    minOrder: 699,
  },
  {
    code: "FREEDEL",
    title: "FREE Delivery",
    description: "No delivery charge above ₹299",
    type: "freeDelivery",
    value: 0,
    minOrder: 299,
  },
];

// ======================================================
// HELPERS
// ======================================================

const formatPrice = (value) => {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(number);
};

const normalizeQuantity = (quantity) => {
  const value = Number(quantity);

  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
};

const normalizeCart = (cart) => {
  if (!Array.isArray(cart)) {
    return [];
  }

  return cart
    .filter((item) => item && item.id != null)
    .map((item) => ({
      ...item,
      quantity: normalizeQuantity(item.quantity),
      price: Number(item.price) || 0,
    }));
};

const loadCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_KEY);

    if (!savedCart) {
      return [];
    }

    return normalizeCart(JSON.parse(savedCart));
  } catch (error) {
    console.error("Cart loading error:", error);
    return [];
  }
};

const saveCartToLocalStorage = (cart) => {
  try {
    const normalizedCart = normalizeCart(cart);

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(normalizedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Cart saving error:", error);
  }
};

// ======================================================
// COUPON DISCOUNT
// ======================================================

const calculateCouponDiscount = (
  coupon,
  orderSubtotal
) => {
  if (!coupon) {
    return 0;
  }

  if (orderSubtotal < coupon.minOrder) {
    return 0;
  }

  if (coupon.type === "percentage") {
    const discount = Math.round(
      (orderSubtotal * coupon.value) / 100
    );

    return Math.min(
      discount,
      coupon.maxDiscount || discount
    );
  }

  if (coupon.type === "flat") {
    return Math.min(
      coupon.value,
      orderSubtotal
    );
  }

  return 0;
};

// ======================================================
// COMPONENT
// ======================================================

function Cart() {
  const navigate = useNavigate();

  // ====================================================
  // CART
  // ====================================================

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [sort, setSort] = useState("default");

  // ====================================================
  // COUPON
  // ====================================================

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");

  // ====================================================
  // LOAD LOCAL CART
  // ====================================================

  const loadLocalCart = useCallback(() => {
    setCartItems(loadCart());
    setCartLoading(false);
  }, []);

  useEffect(() => {
    loadLocalCart();

    const handleCartUpdated = () => {
      loadLocalCart();
    };

    const handleStorage = (event) => {
      if (event.key === CART_KEY) {
        loadLocalCart();
      }
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [loadLocalCart]);

  // ====================================================
  // SAVE CART
  // ====================================================

  const saveCart = useCallback((updatedCart) => {
    const normalizedCart = normalizeCart(updatedCart);

    setCartItems(normalizedCart);
    saveCartToLocalStorage(normalizedCart);
  }, []);

  // ====================================================
  // CART COUNT
  // ====================================================

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + normalizeQuantity(item.quantity),
      0
    );
  }, [cartItems]);

  // ====================================================
  // SUBTOTAL
  // ====================================================

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const price = Number(item.price) || 0;

        const quantity = normalizeQuantity(
          item.quantity
        );

        return total + price * quantity;
      },
      0
    );
  }, [cartItems]);

  // ====================================================
  // DELIVERY
  // ====================================================

  const delivery = useMemo(() => {
    if (subtotal <= 0) {
      return 0;
    }

    if (
      appliedCoupon?.type === "freeDelivery" &&
      subtotal >= appliedCoupon.minOrder
    ) {
      return 0;
    }

    if (subtotal >= FREE_DELIVERY_LIMIT) {
      return 0;
    }

    return DELIVERY_CHARGE;
  }, [subtotal, appliedCoupon]);

  // ====================================================
  // COUPON DISCOUNT
  // ====================================================

  const couponDiscount = useMemo(() => {
    return calculateCouponDiscount(
      appliedCoupon,
      subtotal
    );
  }, [appliedCoupon, subtotal]);

  // ====================================================
  // GST
  // ====================================================

  const gst = useMemo(() => {
    return Math.round(subtotal * GST_RATE);
  }, [subtotal]);

  // ====================================================
  // TOTAL
  // ====================================================

  const total = useMemo(() => {
    return Math.max(
      0,
      subtotal +
        delivery +
        gst -
        couponDiscount
    );
  }, [
    subtotal,
    delivery,
    gst,
    couponDiscount,
  ]);

  // ====================================================
  // FREE DELIVERY PROGRESS
  // ====================================================

  const amountForFreeDelivery = useMemo(() => {
    if (subtotal >= FREE_DELIVERY_LIMIT) {
      return 0;
    }

    return FREE_DELIVERY_LIMIT - subtotal;
  }, [subtotal]);

  // ====================================================
  // INCREASE
  // ====================================================

  const increaseQty = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (String(item.id) !== String(id)) {
        return item;
      }

      return {
        ...item,
        quantity:
          normalizeQuantity(item.quantity) + 1,
      };
    });

    saveCart(updatedCart);
  };

  // ====================================================
  // DECREASE
  // ====================================================

  const decreaseQty = (id) => {
    const updatedCart = cartItems
      .map((item) => {
        if (String(item.id) !== String(id)) {
          return item;
        }

        const currentQuantity =
          normalizeQuantity(item.quantity);

        return {
          ...item,
          quantity: Math.max(
            0,
            currentQuantity - 1
          ),
        };
      })
      .filter(
        (item) => Number(item.quantity) > 0
      );

    saveCart(updatedCart);
  };

  // ====================================================
  // DELETE
  // ====================================================

  const deleteItem = (id) => {
    const updatedCart = cartItems.filter(
      (item) =>
        String(item.id) !== String(id)
    );

    saveCart(updatedCart);
  };

  // ====================================================
  // APPLY COUPON
  // ====================================================

  const applyCoupon = (code = couponInput) => {
    const cleanCode = String(code || "")
      .trim()
      .toUpperCase();

    setCouponMessage("");
    setCouponError("");

    if (!cleanCode) {
      setCouponError(
        "Please enter a coupon code."
      );
      return;
    }

    const coupon = OFFER_COUPONS.find(
      (item) => item.code === cleanCode
    );

    if (!coupon) {
      setCouponError("Invalid coupon code.");
      setAppliedCoupon(null);
      return;
    }

    if (subtotal < coupon.minOrder) {
      setCouponError(
        `${coupon.code} is valid on orders above ₹${formatPrice(
          coupon.minOrder
        )}.`
      );

      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponInput(coupon.code);
    setCouponError("");

    if (coupon.type === "freeDelivery") {
      setCouponMessage(
        "🎉 FREE Delivery coupon applied successfully!"
      );
    } else {
      const discount =
        calculateCouponDiscount(
          coupon,
          subtotal
        );

      setCouponMessage(
        `🎉 Coupon applied! You saved ₹${formatPrice(
          discount
        )}.`
      );
    }
  };

  // ====================================================
  // REMOVE COUPON
  // ====================================================

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage("");
    setCouponError("");
  };

  // ====================================================
  // CLEAR CART
  // ====================================================

  const clearCart = () => {
    saveCart([]);
    setSort("default");
    removeCoupon();
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) {
      return;
    }

    const shouldClear = window.confirm(
      "Are you sure you want to clear your entire cart?"
    );

    if (shouldClear) {
      clearCart();
    }
  };

  // ====================================================
  // SORT
  // ====================================================

  const sortedItems = useMemo(() => {
    const result = [...cartItems];

    switch (sort) {
      case "name-asc":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(
            String(b.name || "")
          )
        );
        break;

      case "name-desc":
        result.sort((a, b) =>
          String(b.name || "").localeCompare(
            String(a.name || "")
          )
        );
        break;

      case "price-low":
        result.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0)
        );
        break;

      case "quantity-high":
        result.sort(
          (a, b) =>
            normalizeQuantity(b.quantity) -
            normalizeQuantity(a.quantity)
        );
        break;

      default:
        break;
    }

    return result;
  }, [cartItems, sort]);

  // ====================================================
  // CHECKOUT
  // ====================================================

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      window.alert("Your cart is empty.");
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
        delivery,
        gst,
        couponCode:
          appliedCoupon?.code || "",
        couponTitle:
          appliedCoupon?.title || "",
        discount: couponDiscount,
        total,
      },
    });
  };

  // ====================================================
  // CONTINUE SHOPPING
  // ====================================================

  const handleContinueShopping = () => {
    navigate("/restaurants");
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (cartLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 font-bold text-gray-600">
            Loading your cart...
          </p>
        </div>
      </section>
    );
  }

  // ====================================================
  // EMPTY CART
  // ====================================================

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[75vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-4xl border border-orange-100 bg-white p-8 text-center shadow-2xl sm:p-14">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-4xl bg-linear-to-br from-orange-500 to-red-500 text-white shadow-xl">
              <ShoppingBag size={55} />
            </div>

            <h1 className="mt-7 text-3xl font-black text-gray-900 sm:text-4xl">
              Your Cart is Empty
            </h1>

            <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
              Looks like you haven't added
              any delicious food yet.
            </p>

            <button
              type="button"
              onClick={handleContinueShopping}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-orange-500 to-red-500 px-7 py-4 font-black text-white shadow-lg"
            >
              <ShoppingBag size={20} />
              Browse Food
              <ArrowRight size={20} />
            </button>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-bold text-gray-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  size={16}
                  className="text-green-500"
                />
                Secure Payment
              </span>

              <span className="flex items-center gap-1.5">
                <Truck
                  size={16}
                  className="text-orange-500"
                />
                Fast Delivery
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <section className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[4px] text-orange-500">
              BiteRush Food Delivery
            </p>

            <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">
              My{" "}
              <span className="bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Cart
              </span>{" "}
              🛒
            </h1>

            <p className="mt-2 text-gray-500">
              Review your delicious food
              before checkout.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-2xl border border-orange-100 bg-white px-5 py-3 font-bold shadow-lg">
            <ShoppingBag
              size={20}
              className="text-orange-500"
            />

            {cartCount}{" "}
            {cartCount === 1
              ? "Item"
              : "Items"}
          </div>
        </header>

        {/* FREE DELIVERY */}

        {amountForFreeDelivery > 0 && (
          <div className="mb-7 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <p className="text-sm font-bold text-gray-700">
                Add{" "}
                <span className="text-orange-500">
                  ₹{formatPrice(
                    amountForFreeDelivery
                  )}
                </span>{" "}
                more to get{" "}
                <span className="text-green-500">
                  FREE delivery
                </span>
              </p>

              <span className="text-xs font-bold text-gray-400">
                ₹{formatPrice(subtotal)} / ₹
                {formatPrice(FREE_DELIVERY_LIMIT)}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-orange-500 to-red-500"
                style={{
                  width: `${Math.min(
                    (subtotal /
                      FREE_DELIVERY_LIMIT) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {subtotal >= FREE_DELIVERY_LIMIT && (
          <div className="mb-7 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-600">
            <ShieldCheck size={19} />
            Congratulations! You unlocked
            FREE delivery 🎉
          </div>
        )}

        {/* SORT */}

        <div className="mb-7 rounded-3xl border border-orange-100 bg-white p-4 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row">
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none"
            >
              <option value="default">
                Default
              </option>

              <option value="name-asc">
                Name A → Z
              </option>

              <option value="name-desc">
                Name Z → A
              </option>

              <option value="price-low">
                Price Low → High
              </option>

              <option value="price-high">
                Price High → Low
              </option>

              <option value="quantity-high">
                Most Quantity
              </option>
            </select>

            <button
              type="button"
              onClick={handleClearCart}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-4 font-bold text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          </div>
        </div>

        {/* COUPON */}

        <div className="mb-7 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">
          <div className="bg-linear-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white">
            <div className="flex items-center gap-2">
              <Tag size={22} />

              <span className="text-xs font-black uppercase tracking-[3px]">
                Special Offers
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-black">
              Save More on Your Order 🎁
            </h2>

            <p className="mt-1 text-sm text-white/80">
              Grab an offer before checking
              out.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Tag
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
                />

                <input
                  type="text"
                  value={couponInput}
                  onChange={(event) => {
                    setCouponInput(
                      event.target.value.toUpperCase()
                    );

                    setCouponError("");
                    setCouponMessage("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      applyCoupon();
                    }
                  }}
                  placeholder="Enter coupon code"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 font-bold outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => applyCoupon()}
                className="rounded-2xl bg-linear-to-r from-orange-500 to-red-500 px-7 py-4 font-black text-white"
              >
                Apply Coupon
              </button>
            </div>

            {couponMessage && (
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3">
                <p className="text-sm font-bold text-green-600">
                  {couponMessage}
                </p>

                <button
                  type="button"
                  onClick={removeCoupon}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {couponError && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3">
                <p className="text-sm font-bold text-red-500">
                  {couponError}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {OFFER_COUPONS.map((offer) => {
                const isApplied =
                  appliedCoupon?.code ===
                  offer.code;

                const isEligible =
                  subtotal >= offer.minOrder;

                return (
                  <article
                    key={offer.code}
                    className={`rounded-2xl border p-4 ${
                      isApplied
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="text-3xl">
                        {offer.type ===
                        "percentage"
                          ? "🔥"
                          : offer.type === "flat"
                          ? "💰"
                          : "🚚"}
                      </div>

                      {isApplied && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-black text-green-600">
                          Applied
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-lg font-black text-gray-900">
                      {offer.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {offer.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="rounded-lg border border-dashed border-orange-300 bg-white px-3 py-1.5 text-xs font-black text-orange-500">
                        {offer.code}
                      </span>

                      <button
                        type="button"
                        disabled={
                          isApplied ||
                          !isEligible
                        }
                        onClick={() =>
                          applyCoupon(
                            offer.code
                          )
                        }
                        className={`rounded-xl px-3 py-2 text-xs font-black ${
                          isApplied
                            ? "bg-green-100 text-green-600"
                            : isEligible
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {isApplied
                          ? "Applied"
                          : isEligible
                          ? "Apply"
                          : `Min ₹${formatPrice(
                              offer.minOrder
                            )}`}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN GRID */}

        <div className="grid gap-7 lg:grid-cols-[1.6fr_0.8fr]">

          {/* CART ITEMS */}

          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-xl sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Your Items
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {sortedItems.length}{" "}
                  {sortedItems.length === 1
                    ? "item"
                    : "items"}{" "}
                  found
                </p>
              </div>

              <span className="hidden items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-black text-orange-500 sm:flex">
                <Utensils size={14} />
                Fresh Food
              </span>
            </div>

            <div className="space-y-4">
              {sortedItems.map((item) => {
                const price =
                  Number(item.price) || 0;

                const quantity =
                  normalizeQuantity(
                    item.quantity
                  );

                const itemTotal =
                  price * quantity;

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-gray-100 p-4 hover:border-orange-200 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                      <div className="relative shrink-0">
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
                          }
                          alt={
                            item.name ||
                            "Food item"
                          }
                          loading="lazy"
                          className="h-32 w-full rounded-2xl object-cover sm:h-24 sm:w-24"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                            event.currentTarget.onerror =
                              null;
                          }}
                        />

                        {item.category && (
                          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-black text-orange-500 shadow">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-black text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          Fresh & Delicious
                        </p>

                        <p className="mt-2 font-black text-orange-500">
                          ₹{formatPrice(price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">

                        <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQty(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-7 text-center font-black">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQty(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <strong className="text-lg font-black text-gray-900">
                            ₹{formatPrice(itemTotal)}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              deleteItem(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* ORDER SUMMARY */}

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl bg-gray-950 text-white shadow-2xl">

              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                    <ReceiptText
                      className="text-orange-400"
                      size={22}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-orange-400">
                      BiteRush
                    </p>

                    <h2 className="text-2xl font-black">
                      Order Summary
                    </h2>
                  </div>
                </div>

                <div className="mt-7 space-y-5">
                  <div className="flex justify-between text-gray-400">
                    <span>Items</span>

                    <strong className="text-white">
                      {cartCount}
                    </strong>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>

                    <strong className="text-white">
                      ₹{formatPrice(subtotal)}
                    </strong>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Delivery</span>

                    <strong
                      className={
                        delivery === 0
                          ? "text-green-400"
                          : "text-white"
                      }
                    >
                      {delivery === 0
                        ? "FREE"
                        : `₹${formatPrice(
                            delivery
                          )}`}
                    </strong>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>GST (5%)</span>

                    <strong className="text-white">
                      ₹{formatPrice(gst)}
                    </strong>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Coupon Discount</span>

                      <strong>
                        - ₹
                        {formatPrice(
                          couponDiscount
                        )}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="my-6 border-t border-white/10" />

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-sm text-gray-400">
                      Grand Total
                    </span>

                    <p className="mt-1 text-xs text-gray-500">
                      Inclusive of applicable
                      taxes
                    </p>
                  </div>

                  <strong className="text-3xl font-black text-orange-400">
                    ₹{formatPrice(total)}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-7 flex w-full items-center justify-between rounded-2xl bg-linear-to-r from-orange-500 to-red-500 px-6 py-4 font-black"
                >
                  <span>
                    Proceed to Checkout
                  </span>

                  <ArrowRight size={21} />
                </button>

                <button
                  type="button"
                  onClick={
                    handleContinueShopping
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-6 py-3 font-bold text-gray-400 hover:border-orange-500 hover:text-orange-400"
                >
                  <ArrowLeft size={17} />
                  Continue Shopping
                </button>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/10">
                <div className="bg-gray-950 p-4 text-center">
                  <ShieldCheck
                    size={21}
                    className="mx-auto text-green-400"
                  />

                  <p className="mt-2 text-[11px] font-bold text-gray-400">
                    Secure Payment
                  </p>
                </div>

                <div className="bg-gray-950 p-4 text-center">
                  <Truck
                    size={21}
                    className="mx-auto text-orange-400"
                  />

                  <p className="mt-2 text-[11px] font-bold text-gray-400">
                    Fast Delivery
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Cart;
