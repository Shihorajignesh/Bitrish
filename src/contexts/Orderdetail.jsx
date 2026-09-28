import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  Utensils,
  XCircle,
} from "lucide-react";

const ORDERS_KEY = "orders";

const PAYMENT_LABELS = {
  upi: "UPI",
  card: "Credit / Debit Card",
  cod: "Cash on Delivery",
  cash: "Cash on Delivery",
};

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(
    location.state?.order || null
  );

  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET ORDER ID
  // =====================================================

  const getOrderIdFromUrl = useCallback(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    return params.get("orderId");
  }, []);

  // =====================================================
  // LOAD ORDER
  // =====================================================

  const loadOrder = useCallback(() => {
    try {
      // -------------------------------------------------
      // 1. First preference: navigation state
      // -------------------------------------------------

      const stateOrder = location.state?.order;

      if (
        stateOrder &&
        typeof stateOrder === "object" &&
        stateOrder.orderId
      ) {
        setOrder(stateOrder);
        setLoading(false);
        return;
      }

      // -------------------------------------------------
      // 2. Try orderId from URL
      // -------------------------------------------------

      const urlOrderId = getOrderIdFromUrl();

      // -------------------------------------------------
      // 3. Read localStorage
      // -------------------------------------------------

      const savedOrders =
        localStorage.getItem(ORDERS_KEY);

      if (!savedOrders) {
        setOrder(null);
        setLoading(false);
        return;
      }

      const parsedOrders = JSON.parse(savedOrders);

      if (!Array.isArray(parsedOrders)) {
        setOrder(null);
        setLoading(false);
        return;
      }

      // -------------------------------------------------
      // Find exact order
      // -------------------------------------------------

      let foundOrder = null;

      if (urlOrderId) {
        foundOrder = parsedOrders.find(
          (item) =>
            item &&
            String(item.orderId) ===
              String(urlOrderId)
        );
      }

      // -------------------------------------------------
      // If no URL orderId, use latest order
      // -------------------------------------------------

      if (!foundOrder && !urlOrderId) {
        const validOrders = parsedOrders.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            item.orderId
        );

        validOrders.sort((a, b) => {
          const dateA = new Date(
            a.createdAt || 0
          ).getTime();

          const dateB = new Date(
            b.createdAt || 0
          ).getTime();

          return dateB - dateA;
        });

        foundOrder = validOrders[0] || null;
      }

      setOrder(foundOrder);
    } catch (error) {
      console.error(
        "Failed to load order:",
        error
      );

      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [location.state, getOrderIdFromUrl]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // =====================================================
  // LISTEN FOR ORDER UPDATES
  // =====================================================

  useEffect(() => {
    const handleOrdersUpdated = () => {
      loadOrder();
    };

    window.addEventListener(
      "ordersUpdated",
      handleOrdersUpdated
    );

    window.addEventListener(
      "storage",
      handleOrdersUpdated
    );

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        handleOrdersUpdated
      );

      window.removeEventListener(
        "storage",
        handleOrdersUpdated
      );
    };
  }, [loadOrder]);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatPrice = useCallback((price) => {
    const amount = Number(price) || 0;

    return amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  }, []);

  const getItemTotal = useCallback((item) => {
    const price = Number(item?.price) || 0;
    const quantity = Number(item?.quantity) || 0;

    return price * quantity;
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getPaymentLabel = useCallback(
    (paymentMethod) => {
      const key = String(
        paymentMethod || ""
      ).toLowerCase();

      return (
        PAYMENT_LABELS[key] ||
        paymentMethod ||
        "Not available"
      );
    },
    []
  );

  const normalizeStatus = useCallback(
    (status) => {
      return String(status || "")
        .trim()
        .toLowerCase()
        .replace(/-/g, "_");
    },
    []
  );

  const getStatusConfig = useCallback(
    (status) => {
      const normalizedStatus =
        normalizeStatus(status);

      if (normalizedStatus === "delivered") {
        return {
          label: "Delivered",
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100",
        };
      }

      if (normalizedStatus === "cancelled") {
        return {
          label: "Cancelled",
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100",
        };
      }

      if (
        normalizedStatus ===
          "out_for_delivery" ||
        normalizedStatus === "outfordelivery"
      ) {
        return {
          label: "Out for Delivery",
          icon: Truck,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
        };
      }

      if (
        normalizedStatus === "confirmed" ||
        normalizedStatus === "accepted"
      ) {
        return {
          label:
            normalizedStatus === "accepted"
              ? "Accepted"
              : "Confirmed",
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100",
        };
      }

      if (
        normalizedStatus === "preparing" ||
        normalizedStatus === "processing"
      ) {
        return {
          label: "Preparing",
          icon: Clock3,
          color: "text-orange-600",
          bg: "bg-orange-50",
          border: "border-orange-100",
        };
      }

      return {
        label: status || "Order Placed",
        icon: Clock3,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-100",
      };
    },
    [normalizeStatus]
  );

  // =====================================================
  // DERIVED DATA
  // =====================================================

  const items = useMemo(() => {
    if (!Array.isArray(order?.items)) {
      return [];
    }

    return order.items;
  }, [order]);

  const address = useMemo(() => {
    return order?.address &&
      typeof order.address === "object"
      ? order.address
      : {};
  }, [order]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + getItemTotal(item),
      0
    );
  }, [items, getItemTotal]);

  const deliveryFee = useMemo(() => {
    return Number(
      order?.deliveryFee ??
        order?.deliveryCharge ??
        0
    ) || 0;
  }, [order]);

  const discount = useMemo(() => {
    return Number(order?.discount || 0) || 0;
  }, [order]);

  const totalAmount = useMemo(() => {
    if (
      order?.total !== undefined &&
      order?.total !== null &&
      order?.total !== ""
    ) {
      return Number(order.total) || 0;
    }

    return Math.max(
      subtotal + deliveryFee - discount,
      0
    );
  }, [
    order,
    subtotal,
    deliveryFee,
    discount,
  ]);

  const normalizedStatus = normalizeStatus(
    order?.status
  );

  const statusConfig = getStatusConfig(
    order?.status
  );

  const StatusIcon = statusConfig.icon;

  const isDelivered =
    normalizedStatus === "delivered";

  const isCancelled =
    normalizedStatus === "cancelled";

  const isConfirmed =
    [
      "confirmed",
      "accepted",
      "out_for_delivery",
      "outfordelivery",
      "delivered",
    ].includes(normalizedStatus);

  const isOutForDelivery =
    [
      "out_for_delivery",
      "outfordelivery",
      "delivered",
    ].includes(normalizedStatus);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />

            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
            </div>
          </div>

          <div className="mb-5 h-40 animate-pulse rounded-3xl bg-white" />

          <div className="mb-5 h-48 animate-pulse rounded-3xl bg-white" />

          <div className="h-96 animate-pulse rounded-3xl bg-white" />
        </div>
      </section>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <Package
              size={36}
              className="text-orange-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            We couldn't find this order. Please go
            back to your orders and try again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-black text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            aria-label="Back to orders"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-500 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              My Orders
            </p>

            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Order Details
            </h1>
          </div>
        </div>

        {/* =================================================
            STATUS HERO
        ================================================== */}

        <div
          className={`mb-5 overflow-hidden rounded-3xl border ${statusConfig.border} ${statusConfig.bg} p-6 sm:p-8`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <StatusIcon
                  size={34}
                  className={statusConfig.color}
                />
              </div>

              <div className="min-w-0">
                <p
                  className={`text-sm font-bold ${statusConfig.color}`}
                >
                  Order Status
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {statusConfig.label}
                </h2>

                <p className="mt-1 truncate text-sm text-gray-500">
                  Order #{order.orderId}
                </p>
              </div>
            </div>

            {!isDelivered && !isCancelled && (
              <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock3
                    size={18}
                    className="text-orange-500"
                  />

                  <span className="text-xs font-bold text-gray-400">
                    Estimated Delivery
                  </span>
                </div>

                <p className="mt-1 text-sm font-black text-orange-600">
                  {order.estimatedDelivery ||
                    "Will be updated soon"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            ORDER INFORMATION
        ================================================== */}

        <div className="mb-5 grid gap-4 sm:grid-cols-2">

          {/* ORDER ID */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                <Package
                  size={21}
                  className="text-orange-500"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900">
                  Order ID
                </p>

                <p className="truncate text-sm font-black text-slate-900">
                  {order.orderId}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock3 size={14} />
                Ordered on
              </div>

              <p className="mt-1 text-sm font-bold text-slate-700">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* PAYMENT */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <CreditCard
                  size={21}
                  className="text-blue-500"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-400">
                  Payment Method
                </p>

                <p className="truncate text-sm font-black text-slate-900">
                  {getPaymentLabel(
                    order.paymentMethod
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-gray-400">
                Payment Amount
              </p>

              <p className="mt-1 text-lg font-black text-orange-500">
                ₹{formatPrice(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            ORDER ITEMS
        ================================================== */}

        <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <ShoppingBag
                size={21}
                className="text-orange-500"
              />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Order Items
              </h2>

              <p className="text-xs text-gray-400">
                {items.length}{" "}
                {items.length === 1
                  ? "item"
                  : "items"}
              </p>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={
                    item.id ||
                    item._id ||
                    `${item.name || "item"}-${index}`
                  }
                  className="flex gap-3 rounded-2xl bg-slate-50 p-3 sm:p-4"
                >
                  {/* IMAGE */}

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={
                        item.name ||
                        "Food item"
                      }
                      loading="lazy"
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-orange-100">
                      <Utensils
                        size={27}
                        className="text-orange-500"
                      />
                    </div>
                  )}

                  {/* ITEM INFO */}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-black text-slate-900 sm:text-base">
                      {item.name || "Food Item"}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      ₹{formatPrice(item.price)} ×{" "}
                      {Number(item.quantity) || 0}
                    </p>

                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* ITEM TOTAL */}

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-black text-slate-900">
                      ₹
                      {formatPrice(
                        getItemTotal(item)
                      )}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Qty:{" "}
                      {Number(item.quantity) || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <ShoppingBag
                size={32}
                className="mx-auto text-gray-400"
              />

              <p className="mt-2 text-sm text-gray-500">
                No items found for this order.
              </p>
            </div>
          )}

          {/* =================================================
              PRICE SUMMARY
          ================================================== */}

          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="ml-auto max-w-sm space-y-3">

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">
                  Item Total
                </span>

                <span className="font-bold text-slate-700">
                  ₹{formatPrice(subtotal)}
                </span>
              </div>

              {deliveryFee > 0 && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Delivery Fee
                  </span>

                  <span className="font-bold text-slate-700">
                    ₹{formatPrice(deliveryFee)}
                  </span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Discount
                  </span>

                  <span className="font-bold text-green-600">
                    -₹{formatPrice(discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                <span className="font-black text-slate-900">
                  Total
                </span>

                <span className="text-xl font-black text-orange-500">
                  ₹{formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            DELIVERY ADDRESS
        ================================================== */}

        <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <MapPin
                size={21}
                className="text-green-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Delivery Address
              </h2>

              <p className="text-xs text-gray-400">
                Your food will be delivered here
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-green-50 p-5">
            <p className="text-base font-black text-slate-900">
              {address.name ||
                address.fullName ||
                address.customerName ||
                "Customer"}
            </p>

            {(address.phone ||
              address.mobile ||
              address.contact) && (
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <Phone size={15} />

                {address.phone ||
                  address.mobile ||
                  address.contact}
              </p>
            )}

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {address.address ||
                address.fullAddress ||
                address.street ||
                address.line1 ||
                "Address not available"}
            </p>

            {(address.area ||
              address.locality) && (
              <p className="mt-1 text-sm text-gray-600">
                {address.area ||
                  address.locality}
              </p>
            )}

            <p className="mt-1 text-sm font-bold text-slate-700">
              {address.city || ""}
              {address.state
                ? `, ${address.state}`
                : ""}
              {address.pincode
                ? ` - ${address.pincode}`
                : ""}
            </p>
          </div>
        </div>

        {/* =================================================
            DELIVERY STATUS
        ================================================== */}

        {!isCancelled && (
          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <Truck
                  size={21}
                  className="text-blue-500"
                />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Delivery Status
                </h2>

                <p className="text-xs text-gray-400">
                  Order progress
                </p>
              </div>
            </div>

            <div className="relative space-y-7 pl-10">

              {/* VERTICAL LINE */}

              <div className="absolute left-3.75 top-4 bottom-5 w-0.5 bg-slate-200" />

              {/* ORDER PLACED */}

              <div className="relative">
                <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white ring-4 ring-green-50">
                  <CheckCircle2 size={17} />
                </div>

                <p className="text-sm font-black text-slate-900">
                  Order Placed
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              {/* CONFIRMED */}

              <div className="relative">
                <div
                  className={`absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ${
                    isConfirmed
                      ? "bg-green-500 text-white ring-green-50"
                      : "bg-slate-200 text-gray-400 ring-slate-50"
                  }`}
                >
                  <CheckCircle2 size={17} />
                </div>

                <p className="text-sm font-black text-slate-900">
                  Restaurant Confirmed
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {isConfirmed
                    ? "Restaurant has confirmed your order"
                    : "Waiting for restaurant confirmation"}
                </p>
              </div>

              {/* OUT FOR DELIVERY */}

              <div className="relative">
                <div
                  className={`absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ${
                    isOutForDelivery
                      ? "bg-blue-500 text-white ring-blue-50"
                      : "bg-slate-200 text-gray-400 ring-slate-50"
                  }`}
                >
                  <Truck size={17} />
                </div>

                <p className="text-sm font-black text-slate-900">
                  Out for Delivery
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {isOutForDelivery
                    ? "Delivery partner is on the way"
                    : "Not started yet"}
                </p>
              </div>

              {/* DELIVERED */}

              <div className="relative">
                <div
                  className={`absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ${
                    isDelivered
                      ? "bg-green-500 text-white ring-green-50"
                      : "bg-slate-200 text-gray-400 ring-slate-50"
                  }`}
                >
                  <CheckCircle2 size={17} />
                </div>

                <p className="text-sm font-black text-slate-900">
                  Delivered
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {isDelivered
                    ? "Order delivered successfully"
                    : "Waiting for delivery"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            CANCELLED
        ================================================== */}

        {isCancelled && (
          <div className="mb-5 rounded-3xl border border-red-100 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                <XCircle
                  size={23}
                  className="text-red-500"
                />
              </div>

              <div>
                <h2 className="font-black text-red-700">
                  Order Cancelled
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-600">
                  This order has been cancelled and
                  will not be delivered.
                </p>

                {order.cancelReason && (
                  <p className="mt-2 text-sm font-bold text-red-700">
                    Reason: {order.cancelReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ACTION BUTTONS
        ================================================== */}

        <div className="flex flex-col gap-3 pb-8 sm:flex-row">

          <button
            type="button"
            onClick={() =>
              navigate("/restaurant")
            }
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            Order Again
          </button>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:border-orange-300 hover:text-orange-500 active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Back to My Orders
          </button>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;
