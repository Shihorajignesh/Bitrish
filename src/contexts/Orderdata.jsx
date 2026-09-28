
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bike,
  CheckCircle,
  Clock,
  Eye,
  Heart,
  Package,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  Trash2,
  XCircle,
} from "lucide-react";

const ORDER_KEY = "orders";
const CART_KEY = "cartItems";
const WISHLIST_KEY = "wishlist";

const STATUS = {
  CURRENT: [
    "confirmed",
    "accepted",
    "preparing",
    "processing",
    "out_for_delivery",
  ],
  COMPLETED: ["delivered"],
  CANCELLED: ["cancelled"],
};

function Orderdata() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem(ORDER_KEY);

      if (!savedOrders) {
        setOrders([]);
        return;
      }

      const parsedOrders = JSON.parse(savedOrders);

      if (Array.isArray(parsedOrders)) {
        setOrders(parsedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadOrders();

    const handleOrdersUpdated = () => {
      loadOrders();
    };

    const handleStorage = (event) => {
      if (event.key === ORDER_KEY) {
        loadOrders();
      }
    };

    window.addEventListener("ordersUpdated", handleOrdersUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("ordersUpdated", handleOrdersUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      loadOrders();
    }, 300);
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (order) => {
    return String(
      order?.status ||
        order?.orderStatus ||
        "confirmed"
    ).toLowerCase();
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {
    if (activeTab === "current") {
      return orders.filter((order) =>
        STATUS.CURRENT.includes(getStatus(order))
      );
    }

    if (activeTab === "completed") {
      return orders.filter((order) =>
        STATUS.COMPLETED.includes(getStatus(order))
      );
    }

    if (activeTab === "cancelled") {
      return orders.filter((order) =>
        STATUS.CANCELLED.includes(getStatus(order))
      );
    }

    return orders;
  }, [orders, activeTab]);

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = (status) => {
    const statusMap = {
      confirmed: "Confirmed",
      accepted: "Accepted",
      preparing: "Preparing",
      processing: "Processing",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return statusMap[status] || "Confirmed";
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    if (status === "delivered") {
      return <CheckCircle size={18} />;
    }

    if (status === "cancelled") {
      return <XCircle size={18} />;
    }

    if (status === "out_for_delivery") {
      return <Bike size={18} />;
    }

    return <Clock size={18} />;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    if (status === "delivered") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (status === "cancelled") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    if (status === "out_for_delivery") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }

    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  };

  // =====================================================
  // ORDER ID
  // =====================================================

  const getOrderId = (order) => {
    return (
      order?.orderId ||
      order?.id ||
      "BR-ORDER"
    );
  };

  // =====================================================
  // DATE
  // =====================================================

  const getOrderDate = (order) => {
    const date =
      order?.createdAt ||
      order?.date ||
      order?.orderDate;

    if (!date) {
      return "Recent Order";
    }

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recent Order";
    }
  };

  // =====================================================
  // ITEMS
  // =====================================================

  const getItems = (order) => {
    if (Array.isArray(order?.items)) {
      return order.items;
    }

    if (Array.isArray(order?.cartItems)) {
      return order.cartItems;
    }

    if (Array.isArray(order?.products)) {
      return order.products;
    }

    return [];
  };

  // =====================================================
  // ITEM NAME
  // =====================================================

  const getItemName = (item) => {
    return (
      item?.name ||
      item?.title ||
      item?.foodName ||
      "Food Item"
    );
  };

  // =====================================================
  // ITEM IMAGE
  // =====================================================

  const getItemImage = (item) => {
    return (
      item?.image ||
      item?.img ||
      item?.photo ||
      "/photo-1504674900247-0877df9cc836.jpg"
    );
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const getTotal = (order) => {
    const total =
      order?.total ??
      order?.grandTotal ??
      order?.amount ??
      order?.totalAmount ??
      0;

    const numericTotal = Number(total);

    return Number.isFinite(numericTotal)
      ? numericTotal
      : 0;
  };

  // =====================================================
  // PAYMENT
  // =====================================================

  const getPayment = (order) => {
    return (
      order?.paymentMethod ||
      order?.payment ||
      "Cash on Delivery"
    );
  };

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (order) => {
    const id = getOrderId(order);

    navigate(
      `/order-detail?orderId=${encodeURIComponent(id)}`,
      {
        state: { order },
      }
    );
  };

  // =====================================================
  // TRACK ORDER
  // =====================================================

  const handleTrackOrder = (order) => {
    const id = getOrderId(order);

    navigate(
      `/order-success?orderId=${encodeURIComponent(id)}`,
      {
        state: { order },
      }
    );
  };

  // =====================================================
  // REORDER
  // =====================================================

  const handleReorder = (order) => {
    try {
      const items = getItems(order);

      if (!items.length) {
        alert("No food items found in this order.");
        return;
      }

      const existingCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      const cart = Array.isArray(existingCart)
        ? existingCart
        : [];

      const updatedCart = [...cart];

      items.forEach((item) => {
        const itemId =
          item?.id ||
          item?.foodId ||
          item?.productId ||
          item?.name;

        const existingIndex = updatedCart.findIndex(
          (cartItem) =>
            (cartItem?.id ||
              cartItem?.foodId ||
              cartItem?.productId ||
              cartItem?.name) === itemId
        );

        if (existingIndex !== -1) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity:
              Number(
                updatedCart[existingIndex]?.quantity || 1
              ) + Number(item?.quantity || 1),
          };
        } else {
          updatedCart.push({
            ...item,
            quantity: Number(item?.quantity || 1),
          });
        }
      });

      localStorage.setItem(
        CART_KEY,
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/cart");
    } catch (error) {
      console.error("Reorder failed:", error);
      alert("Unable to reorder this item.");
    }
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist = (order) => {
    try {
      const items = getItems(order);

      const savedWishlist = JSON.parse(
        localStorage.getItem(WISHLIST_KEY) || "[]"
      );

      const wishlist = Array.isArray(savedWishlist)
        ? savedWishlist
        : [];

      items.forEach((item) => {
        const itemId =
          item?.id ||
          item?.foodId ||
          item?.productId ||
          item?.name;

        const alreadyExists = wishlist.some(
          (wishItem) =>
            (wishItem?.id ||
              wishItem?.foodId ||
              wishItem?.productId ||
              wishItem?.name) === itemId
        );

        if (!alreadyExists) {
          wishlist.push(item);
        }
      });

      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
      );

      window.dispatchEvent(new Event("wishlistUpdated"));

      alert("Added to wishlist ❤️");
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const handleDelete = (order) => {
    const id = getOrderId(order);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    const updatedOrders = orders.filter(
      (item) => getOrderId(item) !== id
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      ORDER_KEY,
      JSON.stringify(updatedOrders)
    );

    window.dispatchEvent(new Event("ordersUpdated"));
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  const EmptyOrders = () => (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-orange-500/10 bg-white p-8 py-16 text-center shadow-xl shadow-black/10">

      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
        <ShoppingBag
          size={38}
          className="text-orange-500"
        />
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        No Orders Found
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        You don't have any orders in this section yet.
        Start ordering your favourite food now!
      </p>

      <Link
        to="/restaurants"
        className="mt-6 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-105 hover:shadow-orange-500/30"
      >
        Explore Restaurants
      </Link>
    </div>
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-6xl animate-pulse">

          <div className="h-10 w-56 rounded-xl bg-white/10" />

          <div className="mt-8 h-40 rounded-3xl bg-white/10" />

          <div className="mt-5 h-40 rounded-3xl bg-white/10" />

        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-orange-400"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/20">
                <Package size={24} />
              </div>

              <div>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  My Orders
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Track and manage all your BiteRush orders
                </p>

              </div>
            </div>
          </div>

          {/* REFRESH */}
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-orange-50 hover:text-orange-600"
          >
            <RefreshCw size={18} />
            Refresh Orders
          </button>

        </div>

        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {/* TOTAL */}
          <div className="rounded-2xl border border-white/10 bg-white p-5 shadow-lg shadow-black/10">
            <p className="text-sm font-medium text-slate-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {orders.length}
            </p>
          </div>

          {/* CURRENT */}
          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-lg shadow-black/10">
            <p className="text-sm font-medium text-slate-500">
              Current
            </p>

            <p className="mt-2 text-3xl font-black text-orange-500">
              {
                orders.filter((order) =>
                  STATUS.CURRENT.includes(
                    getStatus(order)
                  )
                ).length
              }
            </p>
          </div>

          {/* DELIVERED */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-lg shadow-black/10">
            <p className="text-sm font-medium text-slate-500">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-500">
              {
                orders.filter((order) =>
                  STATUS.COMPLETED.includes(
                    getStatus(order)
                  )
                ).length
              }
            </p>
          </div>

          {/* CANCELLED */}
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg shadow-black/10">
            <p className="text-sm font-medium text-slate-500">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-black text-red-500">
              {
                orders.filter((order) =>
                  STATUS.CANCELLED.includes(
                    getStatus(order)
                  )
                ).length
              }
            </p>
          </div>

        </div>

        {/* TABS */}
        <div className="mb-6 flex overflow-x-auto rounded-2xl border border-white/10 bg-white p-1.5 shadow-lg">

          {/* CURRENT */}
          <button
            onClick={() => setActiveTab("current")}
            className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === "current"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <Clock size={17} />
            Current Orders
          </button>

          {/* COMPLETED */}
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === "completed"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <CheckCircle size={17} />
            Completed
          </button>

          {/* CANCELLED */}
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === "cancelled"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <XCircle size={17} />
            Cancelled
          </button>

        </div>

        {/* ORDERS */}
        {filteredOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-5">

            {filteredOrders.map((order, index) => {

              const status = getStatus(order);
              const items = getItems(order);
              const orderId = getOrderId(order);

              return (
                <article
                  key={`${orderId}-${index}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/20 transition hover:border-orange-300 hover:shadow-orange-500/10"
                >

                  {/* ORDER HEADER */}
                  <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="text-base font-black text-slate-900">
                          #{orderId}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          {getStatusText(status)}
                        </span>

                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        {getOrderDate(order)}
                      </p>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="text-xs font-medium text-slate-400">
                        Total Amount
                      </p>

                      <p className="text-2xl font-black text-orange-500">
                        ₹{getTotal(order).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {getPayment(order)}
                      </p>

                    </div>

                  </div>

                  {/* FOOD ITEMS */}
                  <div className="p-5">

                    {items.length > 0 ? (
                      <div className="space-y-3">

                        {items.slice(0, 4).map(
                          (item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-orange-200 hover:bg-orange-50/50"
                            >

                              <img
                                src={getItemImage(item)}
                                alt={getItemName(item)}
                                className="h-16 w-16 rounded-xl object-cover shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/photo-1504674900247-0877df9cc836.jpg";
                                }}
                              />

                              <div className="min-w-0 flex-1">

                                <h3 className="truncate text-sm font-bold text-slate-900">
                                  {getItemName(item)}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                  Qty:{" "}
                                  {item?.quantity || 1}
                                </p>

                              </div>

                              <p className="text-sm font-black text-slate-900">
                                ₹
                                {Number(
                                  item?.price || 0
                                ).toFixed(2)}
                              </p>

                            </div>
                          )
                        )}

                        {items.length > 4 && (
                          <p className="pt-1 text-center text-xs font-medium text-slate-400">
                            + {items.length - 4} more items
                          </p>
                        )}

                      </div>
                    ) : (
                      <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-400">
                        Food item details unavailable
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">

                      {/* VIEW DETAILS */}
                      <button
                        onClick={() =>
                          handleViewDetails(order)
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Eye size={17} />
                        View Details
                      </button>

                      {/* TRACK */}
                      {STATUS.CURRENT.includes(status) && (
                        <button
                          onClick={() =>
                            handleTrackOrder(order)
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-orange-500/30"
                        >
                          <Bike size={17} />
                          Track Order
                        </button>
                      )}

                      {/* REORDER */}
                      {(status === "delivered" ||
                        status === "cancelled") && (
                        <button
                          onClick={() =>
                            handleReorder(order)
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                        >
                          <RotateCcw size={17} />
                          Reorder
                        </button>
                      )}

                      {/* WISHLIST */}
                      {status === "delivered" && (
                        <button
                          onClick={() =>
                            handleWishlist(order)
                          }
                          className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
                        >
                          <Heart size={17} />
                          Wishlist
                        </button>
                      )}

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDelete(order)
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                        Delete
                      </button>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Orderdata;

