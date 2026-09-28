import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  Lock,
  ShoppingBag,
  ShieldCheck,
  Clock3,
  XCircle,
} from "lucide-react";

const METHODS = {
  UPI: "upi",
  CARD: "card",
  BANK: "netbanking",
  COD: "cod",
};

const DELIVERY_LIMIT = 499;
const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

const money = (value) =>
  `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;

const getOrder = (location) => {
  const routerOrder = location.state?.order;

  if (routerOrder?.items?.length) {
    return routerOrder;
  }

  try {
    const currentOrder = JSON.parse(
      localStorage.getItem("currentOrder") || "null"
    );

    if (currentOrder?.items?.length) {
      return currentOrder;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (Array.isArray(cart) && cart.length) {
      return {
        items: cart,
      };
    }
  } catch (error) {
    console.error("Unable to read order data:", error);
  }

  return null;
};

/* ================= CARD VALIDATION ================= */

const validCard = (value) => {
  const digits = String(value).replace(/\D/g, "");

  if (digits.length < 12 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let doubleDigit = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (doubleDigit) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
};

/* ================= HELPERS ================= */

const createOrderId = () =>
  `BR-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

const createTransactionId = () =>
  `TXN-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const formatCardNumber = (value) => {
  const digits = String(value).replace(/\D/g, "").slice(0, 19);

  return digits.replace(/(.{4})/g, "$1 ").trim();
};

function Paymentmethod() {
  const navigate = useNavigate();
  const location = useLocation();

  const [order] = useState(() => getOrder(location));

  const [method, setMethod] = useState(
    location.state?.paymentMethod || METHODS.UPI
  );

  const [upi, setUpi] = useState("");
  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState("");

  /* ================= ITEMS ================= */

  const items = useMemo(() => {
    return (order?.items || []).map((item, index) => ({
      id: item.id || `${item.name || "item"}-${index}`,
      name: item.name || "Food Item",
      price: Number(item.price) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      image: item.image || "",
    }));
  }, [order]);

  /* ================= PRICE ================= */

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [items]);

  const delivery = useMemo(() => {
    if (!subtotal) return 0;

    return subtotal >= DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
  }, [subtotal]);

  const tax = useMemo(() => {
    return Math.round(subtotal * TAX_RATE);
  }, [subtotal]);

  const total = subtotal + delivery + tax;

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  /* ================= PAYMENT METHODS ================= */

  const methods = [
    {
      id: METHODS.UPI,
      title: "UPI",
      subtitle: "Google Pay, PhonePe, Paytm",
      icon: Smartphone,
    },
    {
      id: METHODS.CARD,
      title: "Credit / Debit Card",
      subtitle: "Visa, Mastercard, RuPay",
      icon: CreditCard,
    },
    {
      id: METHODS.BANK,
      title: "Net Banking",
      subtitle: "All major banks",
      icon: Building2,
    },
    {
      id: METHODS.COD,
      title: "Cash on Delivery",
      subtitle: "Pay when your order arrives",
      icon: Banknote,
    },
  ];

  /* ================= VALIDATION ================= */

  const validate = () => {
    setError("");

    if (!items.length) {
      setError("Your cart is empty.");
      return false;
    }

    /* UPI */

    if (method === METHODS.UPI) {
      const upiValue = upi.trim().toLowerCase();

      if (!/^[a-z0-9._-]{2,}@[a-z0-9.-]{2,}$/.test(upiValue)) {
        setError("Please enter a valid UPI ID.");
        return false;
      }
    }

    /* CARD */

    if (method === METHODS.CARD) {
      const cardDigits = card.replace(/\D/g, "");

      if (!validCard(cardDigits)) {
        setError("Please enter a valid card number.");
        return false;
      }

      if (name.trim().length < 2) {
        setError("Please enter card holder name.");
        return false;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        setError("Expiry must be in MM/YY format.");
        return false;
      }

      const [month, year] = expiry.split("/").map(Number);

      const now = new Date();

      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        setError("Your card has expired.");
        return false;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        setError("Please enter a valid CVV.");
        return false;
      }
    }

    /* NET BANKING */

    if (method === METHODS.BANK && !bank) {
      setError("Please select your bank.");
      return false;
    }

    return true;
  };

  /* ================= PLACE ORDER ================= */

 const placeOrder = async (e) => {
  e.preventDefault();

  if (loading) return;

  if (!validate()) return;

  setLoading(true);
  setError("");

  try {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const paymentMethodName = {
      [METHODS.UPI]: "UPI",
      [METHODS.CARD]: "Credit / Debit Card",
      [METHODS.BANK]: "Net Banking",
      [METHODS.COD]: "Cash on Delivery",
    };

    const finalOrder = {
      ...(order || {}),

      orderId: createOrderId(),

      items: items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),

      subtotal: Number(subtotal),
      deliveryFee: Number(delivery),
      tax: Number(tax),
      total: Number(total),

      paymentMethod: paymentMethodName[method],

      paymentStatus:
        method === METHODS.COD ? "Pending" : "Paid",

      transactionId:
        method === METHODS.COD
          ? ""
          : createTransactionId(),

      status: "Confirmed",

      estimatedDelivery: "30-40 mins",

      createdAt: new Date().toISOString(),
    };

    // Get existing orders safely
    let oldOrders = [];

    try {
      const savedOrders = localStorage.getItem("orders");

      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);

        if (Array.isArray(parsedOrders)) {
          oldOrders = parsedOrders;
        }
      }
    } catch (storageError) {
      console.error("Orders storage error:", storageError);
    }

    // Save current order
    localStorage.setItem(
      "currentOrder",
      JSON.stringify(finalOrder)
    );

    // Save last order
    localStorage.setItem(
      "lastOrder",
      JSON.stringify(finalOrder)
    );

    // Save all orders
    localStorage.setItem(
      "orders",
      JSON.stringify([
        finalOrder,
        ...oldOrders,
      ])
    );

    // Clear cart
    localStorage.removeItem("cart");

    // Notify other components
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("ordersUpdated"));

    // Show success
    setSuccessOrder(finalOrder);
  } catch (error) {
    console.error("Payment/order error:", error);

    setError(
      "Something went wrong while placing your order."
    );
  } finally {
    setLoading(false);
  }
};

  /* ================= SUCCESS SCREEN ================= */

  if (successOrder) {
    return (
      <section className="min-h-screen bg-linear-to-br from-orange-50 via-white to-green-50 px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-10">
            <CheckCircle2
              size={75}
              className="mx-auto text-green-500"
            />

            <h1 className="mt-5 text-3xl font-black text-gray-900">
              {successOrder.paymentStatus === "Paid"
                ? "Payment Successful!"
                : "Order Confirmed!"}
            </h1>

            <p className="mt-2 text-gray-500">
              Your order has been successfully confirmed.
            </p>

            <div className="mt-6 space-y-4 rounded-2xl bg-gray-50 p-5 text-left">
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500">
                  Order ID
                </span>

                <b className="text-right">
                  #{successOrder.orderId}
                </b>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500">
                  Payment
                </span>

                <b className="text-right">
                  {successOrder.paymentMethod}
                </b>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500">
                  Status
                </span>

                <b className="text-green-600">
                  {successOrder.paymentStatus}
                </b>
              </div>

              <div className="flex justify-between border-t pt-4">
                <b>Total</b>

                <b className="text-xl text-orange-500">
                  {money(successOrder.total)}
                </b>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-orange-50 p-4 text-left">
              <Clock3 className="shrink-0 text-orange-500" />

              <div>
                <p className="font-bold">
                  Estimated Delivery
                </p>

                <p className="text-sm text-gray-500">
                  30-40 mins
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  navigate("/order-success", {
                    state: {
                      order: successOrder,
                    },
                  })
                }
                className="rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                View Order
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-xl border py-3 font-bold text-gray-700 transition hover:border-orange-400 hover:text-orange-500"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ================= EMPTY ================= */

  if (!items.length) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-orange-50 p-5">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <ShoppingBag
            size={60}
            className="mx-auto text-orange-500"
          />

          <h1 className="mt-5 text-3xl font-black">
            No Order Found
          </h1>

          <p className="mt-2 text-gray-500">
            Please add items to your cart first.
          </p>

          <button
            type="button"
            onClick={() => navigate("/restaurant")}
            className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Order Food
          </button>
        </div>
      </section>
    );
  }

  /* ================= MAIN PAYMENT PAGE ================= */

  return (
    <section className="min-h-screen bg-linear-to-br from-orange-50 via-white to-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              navigate("/checkout", {
                state: {
                  order,
                },
              })
            }
            className="flex items-center gap-2 font-bold text-gray-600 transition hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={20} />

            Back to Checkout
          </button>

          <div className="text-center">
            <p className="text-xs font-black tracking-[3px] text-orange-500">
              BITERUSH
            </p>

            <h1 className="text-3xl font-black">
              Secure Payment
            </h1>
          </div>

          <div className="flex items-center gap-2 font-bold text-green-600">
            <Lock size={18} />

            Secure
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ================= PAYMENT ================= */}

          <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-7">
            <h2 className="text-2xl font-black">
              Choose Payment Method
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select your preferred payment method.
            </p>

            {/* PAYMENT METHOD BUTTONS */}

            <div className="mt-6 grid gap-3">
              {methods.map((item) => {
                const Icon = item.icon;
                const active = method === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setMethod(item.id);
                      setError("");
                    }}
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                        : "border-gray-200 hover:border-orange-300"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-orange-500 text-white"
                          : "bg-orange-100 text-orange-500"
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold">
                        {item.title}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.subtitle}
                      </p>
                    </div>

                    {active && (
                      <CheckCircle2
                        size={22}
                        className="shrink-0 text-orange-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={placeOrder}
              className="mt-6"
            >

              {/* UPI */}

              {method === METHODS.UPI && (
                <div className="rounded-2xl bg-purple-50 p-5">
                  <label
                    htmlFor="upi"
                    className="font-bold text-gray-800"
                  >
                    UPI ID
                  </label>

                  <input
                    id="upi"
                    type="text"
                    value={upi}
                    onChange={(e) => {
                      setUpi(e.target.value);
                      setError("");
                    }}
                    placeholder="9876543210@ybl"
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Example: yourname@upi
                  </p>
                </div>
              )}

              {/* CARD */}

              {method === METHODS.CARD && (
                <div className="space-y-4 rounded-2xl bg-blue-50 p-5">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="font-bold text-gray-800"
                    >
                      Card Number
                    </label>

                    <input
                      id="cardNumber"
                      type="text"
                      value={formatCardNumber(card)}
                      onChange={(e) => {
                        const digits = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 19);

                        setCard(digits);
                        setError("");
                      }}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      className="mt-2 w-full rounded-xl border bg-white px-4 py-3 tracking-wider outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cardName"
                      className="font-bold text-gray-800"
                    >
                      Card Holder Name
                    </label>

                    <input
                      id="cardName"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                      }}
                      autoComplete="cc-name"
                      placeholder="Your name"
                      className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="expiry"
                        className="font-bold text-gray-800"
                      >
                        Expiry
                      </label>

                      <input
                        id="expiry"
                        type="text"
                        value={expiry}
                        onChange={(e) => {
                          let value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);

                          if (value.length > 2) {
                            value =
                              value.slice(0, 2) +
                              "/" +
                              value.slice(2);
                          }

                          setExpiry(value);
                          setError("");
                        }}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cvv"
                        className="font-bold text-gray-800"
                      >
                        CVV
                      </label>

                      <input
                        id="cvv"
                        type="password"
                        value={cvv}
                        onChange={(e) => {
                          setCvv(
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4)
                          );

                          setError("");
                        }}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BANK */}

              {method === METHODS.BANK && (
                <div className="rounded-2xl bg-indigo-50 p-5">
                  <label
                    htmlFor="bank"
                    className="font-bold text-gray-800"
                  >
                    Select Bank
                  </label>

                  <select
                    id="bank"
                    value={bank}
                    onChange={(e) => {
                      setBank(e.target.value);
                      setError("");
                    }}
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">
                      Select your bank
                    </option>

                    <option value="SBI">
                      SBI
                    </option>

                    <option value="HDFC Bank">
                      HDFC Bank
                    </option>

                    <option value="ICICI Bank">
                      ICICI Bank
                    </option>

                    <option value="Axis Bank">
                      Axis Bank
                    </option>

                    <option value="Kotak Mahindra Bank">
                      Kotak Mahindra Bank
                    </option>

                    <option value="Bank of Baroda">
                      Bank of Baroda
                    </option>
                  </select>
                </div>
              )}

              {/* COD */}

              {method === METHODS.COD && (
                <div className="rounded-2xl bg-green-50 p-5">
                  <div className="flex gap-3">
                    <Banknote
                      className="shrink-0 text-green-600"
                      size={24}
                    />

                    <div>
                      <p className="font-bold text-gray-800">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Pay {money(total)} when your food arrives.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600"
                >
                  <XCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-red-500 py-4 font-black text-white shadow-lg transition hover:from-orange-600 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} />

                    {method === METHODS.COD
                      ? `Place Order • ${money(total)}`
                      : `Pay ${money(total)}`}
                  </>
                )}
              </button>
            </form>

            {/* SECURITY */}

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={16} />

              Secure Demo Payment
            </div>
          </div>

          {/* ================= ORDER SUMMARY ================= */}

          <div className="h-fit rounded-3xl bg-white p-6 shadow-xl lg:sticky lg:top-5">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-orange-500" />

              <div>
                <h2 className="text-xl font-black">
                  Order Summary
                </h2>

                <p className="text-sm text-gray-500">
                  {itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {/* ITEMS */}

            <div className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                      <ShoppingBag
                        size={20}
                        className="text-orange-500"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {money(item.price)} × {item.quantity}
                    </p>
                  </div>

                  <b className="shrink-0">
                    {money(
                      item.price * item.quantity
                    )}
                  </b>
                </div>
              ))}
            </div>

            {/* PRICE BREAKDOWN */}

            <div className="mt-6 space-y-3 border-t pt-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>{money(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>

                <span
                  className={
                    delivery === 0
                      ? "font-bold text-green-600"
                      : ""
                  }
                >
                  {delivery === 0
                    ? "FREE"
                    : money(delivery)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>

                <span>{money(tax)}</span>
              </div>

              <div className="flex justify-between border-t pt-4 text-xl font-black">
                <span>Total</span>

                <span className="text-orange-500">
                  {money(total)}
                </span>
              </div>
            </div>

            {/* DELIVERY */}

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-orange-50 p-4">
              <Clock3 className="shrink-0 text-orange-500" />

              <div>
                <p className="text-xs text-gray-500">
                  Estimated Delivery
                </p>

                <p className="font-bold">
                  30-40 mins
                </p>
              </div>
            </div>

            {/* FREE DELIVERY INFO */}

            {subtotal > 0 &&
              subtotal < DELIVERY_LIMIT && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Add{" "}
                  <b className="text-orange-500">
                    {money(
                      DELIVERY_LIMIT - subtotal
                    )}
                  </b>{" "}
                  more for free delivery.
                </p>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Paymentmethod;
