import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  Package,
  Clock3,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Home,
  Phone,
  Receipt,
  Truck,
} from "lucide-react";

const CURRENT_ORDER_KEY = "currentOrder";
const LAST_ORDER_KEY = "lastOrder";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(
    location.state?.order || null
  );

  const [loading, setLoading] = useState(!order);

  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {
    if (order) {
      setLoading(false);
      return;
    }

    try {
      // First priority: currentOrder
      const currentOrder = localStorage.getItem(
        CURRENT_ORDER_KEY
      );

      if (currentOrder) {
        const parsedOrder = JSON.parse(currentOrder);

        if (
          parsedOrder &&
          typeof parsedOrder === "object"
        ) {
          setOrder(parsedOrder);
          setLoading(false);
          return;
        }
      }

      // Second priority: lastOrder
      const lastOrder = localStorage.getItem(
        LAST_ORDER_KEY
      );

      if (lastOrder) {
        const parsedOrder = JSON.parse(lastOrder);

        if (
          parsedOrder &&
          typeof parsedOrder === "object"
        ) {
          setOrder(parsedOrder);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error(
        "Order loading error:",
        error
      );
    }

    setLoading(false);
  }, [order]);

  // =====================================================
  // SAFE ORDER DATA
  // =====================================================

  const orderItems = useMemo(() => {
    if (!Array.isArray(order?.items)) {
      return [];
    }

    return order.items.map((item, index) => ({
      ...item,
      id:
        item.id ??
        `${item.name || "item"}-${index}`,
      name: item.name || "Food Item",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));
  }, [order]);

  // =====================================================
  // PAYMENT NAME
  // =====================================================

  const getPaymentName = (method) => {
    if (!method) {
      return "Payment";
    }

    const value = String(method).toLowerCase();

    if (value === "upi") {
      return "UPI";
    }

    if (
      value === "card" ||
      value.includes("credit") ||
      value.includes("debit")
    ) {
      return "Credit / Debit Card";
    }

    if (
      value === "netbanking" ||
      value.includes("net banking")
    ) {
      return "Net Banking";
    }

    if (
      value === "cod" ||
      value.includes("cash on delivery")
    ) {
      return "Cash on Delivery";
    }

    return method;
  };

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const getPaymentStatus = () => {
    if (!order) {
      return "Pending";
    }

    if (order.paymentStatus) {
      return order.paymentStatus;
    }

    const method = String(
      order.paymentMethod || ""
    ).toLowerCase();

    if (
      method === "cod" ||
      method.includes("cash")
    ) {
      return "Pending";
    }

    return "Paid";
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  // =====================================================
  // ADDRESS SAFE DATA
  // =====================================================

  const address = order?.address || {};

  const customerName =
    address.name ||
    order?.customerName ||
    "Customer";

  const customerPhone =
    address.phone ||
    order?.phone ||
    "Not available";

  const customerAddress =
    address.address ||
    order?.deliveryAddress ||
    "Delivery address not available";

  const customerCity =
    address.city || "";

  const customerPincode =
    address.pincode || "";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 font-bold text-gray-600">
            Loading your order...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 via-white to-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
            <Package
              size={48}
              className="text-orange-500"
            />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900">
            Order Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            We couldn't find your recent order.
            Please go back to the home page and
            place your order again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-lg transition hover:bg-orange-600"
          >
            <Home size={19} />
            Go to Home
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // VALUES
  // =====================================================

  const paymentMethod = getPaymentName(
    order.paymentMethod
  );

  const paymentStatus = getPaymentStatus();

  const isCOD =
    paymentMethod === "Cash on Delivery";

  const totalAmount =
    Number(
      order.total ??
        order.totalAmount ??
        0
    ) || 0;

  const estimatedDelivery =
    order.estimatedDelivery ||
    "30-40 mins";

  const orderStatus =
    order.status ||
    (isCOD
      ? "Confirmed"
      : "Payment Confirmed");

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="min-h-screen bg-linear-to-br from-green-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* =================================================
            SUCCESS HEADER
        ================================================= */}

        <div className="rounded-3xl bg-white p-7 text-center shadow-xl sm:p-10">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              size={62}
              strokeWidth={1.8}
              className="text-green-500"
            />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[3px] text-green-500">
            Order Confirmed
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            {isCOD
              ? "Your Order is Confirmed! 🎉"
              : "Payment Successful! 🎉"}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            {isCOD
              ? "Your food order has been confirmed. Please pay when your order arrives."
              : "Your payment was successful and your food order has been confirmed."}
          </p>

          {/* ORDER ID */}

          <div className="mx-auto mt-7 max-w-md rounded-2xl bg-orange-50 p-5">

            <div className="flex items-center justify-center gap-2 text-orange-500">
              <Receipt size={18} />

              <p className="text-xs font-black uppercase tracking-wider">
                Order Number
              </p>
            </div>

            <p className="mt-2 text-2xl font-black text-orange-600">
              #{order.orderId || "BR-ORDER"}
            </p>

          </div>

          {/* =================================================
              ORDER STATUS CARDS
          ================================================= */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            {/* DELIVERY */}

            <div className="rounded-2xl bg-orange-50 p-5">

              <Clock3
                className="mx-auto text-orange-500"
                size={27}
              />

              <p className="mt-2 text-xs text-gray-500">
                Estimated Delivery
              </p>

              <p className="mt-1 font-black text-gray-900">
                {estimatedDelivery}
              </p>

            </div>

            {/* STATUS */}

            <div className="rounded-2xl bg-green-50 p-5">

              <Truck
                className="mx-auto text-green-500"
                size={27}
              />

              <p className="mt-2 text-xs text-gray-500">
                Order Status
              </p>

              <p className="mt-1 font-black text-green-600">
                {orderStatus}
              </p>

            </div>

            {/* PAYMENT */}

            <div className="rounded-2xl bg-blue-50 p-5">

              <CreditCard
                className="mx-auto text-blue-500"
                size={27}
              />

              <p className="mt-2 text-xs text-gray-500">
                Payment
              </p>

              <p className="mt-1 font-black text-gray-900">
                {paymentMethod}
              </p>

              <p
                className={`mt-1 text-xs font-bold ${
                  paymentStatus === "Paid"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {paymentStatus}
              </p>

            </div>

          </div>
        </div>

        {/* =================================================
            ORDER DETAILS
        ================================================= */}

        <div className="mt-7 grid gap-7 lg:grid-cols-2">

          {/* =================================================
              ITEMS
          ================================================= */}

          <div className="rounded-3xl bg-white p-6 shadow-lg">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                <ShoppingBag
                  size={22}
                  className="text-orange-500"
                />
              </div>

              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Order Items
                </h2>

                <p className="text-sm text-gray-500">
                  {orderItems.length}{" "}
                  {orderItems.length === 1
                    ? "item"
                    : "items"}
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {orderItems.map(
                (item, index) => (
                  <div
                    key={
                      item.id ||
                      `${item.name}-${index}`
                    }
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                  >

                    {/* IMAGE */}

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

                    {/* NAME */}

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate font-bold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        ₹
                        {formatPrice(
                          item.price
                        )}{" "}
                        × {item.quantity}
                      </p>

                    </div>

                    {/* ITEM TOTAL */}

                    <strong className="shrink-0 text-gray-900">
                      ₹
                      {formatPrice(
                        item.price *
                          item.quantity
                      )}
                    </strong>

                  </div>
                )
              )}

            </div>

            {/* PRICE */}

            <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">

              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>

                <span>
                  ₹
                  {formatPrice(
                    order.subtotal
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>

                {Number(
                  order.deliveryFee
                ) === 0 ? (
                  <span className="font-bold text-green-600">
                    FREE
                  </span>
                ) : (
                  <span>
                    ₹
                    {formatPrice(
                      order.deliveryFee
                    )}
                  </span>
                )}
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes & Charges</span>

                <span>
                  ₹
                  {formatPrice(
                    order.tax
                  )}
                </span>
              </div>

              <div className="my-4 border-t border-dashed border-gray-200" />

              <div className="flex items-center justify-between">

                <span className="text-lg font-black text-gray-900">
                  {isCOD
                    ? "Total Amount"
                    : "Total Paid"}
                </span>

                <span className="text-2xl font-black text-orange-500">
                  ₹
                  {formatPrice(
                    totalAmount
                  )}
                </span>

              </div>

            </div>
          </div>

          {/* =================================================
              DELIVERY DETAILS
          ================================================= */}

          <div className="rounded-3xl bg-white p-6 shadow-lg">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                <MapPin
                  size={22}
                  className="text-orange-500"
                />
              </div>

              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Delivery Details
                </h2>

                <p className="text-sm text-gray-500">
                  Your food will be delivered here
                </p>
              </div>

            </div>

            {/* ADDRESS */}

            <div className="rounded-2xl bg-slate-50 p-5">

              <h3 className="font-black text-gray-900">
                {customerName}
              </h3>

              <div className="mt-3 space-y-3">

                <p className="flex gap-2 text-sm text-gray-600">
                  <Phone
                    size={16}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />

                  <span>
                    {customerPhone}
                  </span>
                </p>

                <p className="flex gap-2 text-sm leading-6 text-gray-600">
                  <MapPin
                    size={16}
                    className="mt-1 shrink-0 text-orange-500"
                  />

                  <span>
                    {customerAddress}
                  </span>
                </p>

                {(customerCity ||
                  customerPincode) && (
                  <p className="text-sm font-semibold text-gray-600">
                    {customerCity}

                    {customerCity &&
                      customerPincode &&
                      " - "}

                    {customerPincode}
                  </p>
                )}

              </div>

            </div>

            {/* DELIVERY INFO */}

            <div className="mt-5 rounded-2xl bg-green-50 p-5">

              <div className="flex gap-3">

                <Package
                  size={23}
                  className="shrink-0 text-green-600"
                />

                <div>

                  <p className="font-black text-green-700">
                    Delivery Partner
                  </p>

                  <p className="mt-1 text-sm leading-6 text-green-600">
                    Your order will arrive in{" "}
                    <strong>
                      {estimatedDelivery}
                    </strong>
                    .
                  </p>

                </div>

              </div>

            </div>

            {/* PAYMENT INFO */}

            <div className="mt-5 rounded-2xl bg-blue-50 p-5">

              <div className="flex gap-3">

                <CreditCard
                  size={23}
                  className="shrink-0 text-blue-600"
                />

                <div>

                  <p className="font-black text-blue-700">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm text-blue-600">
                    {paymentMethod}
                  </p>

                  <p className="mt-1 text-xs font-bold text-blue-500">
                    Status: {paymentStatus}
                  </p>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="mt-7 grid gap-3 sm:grid-cols-3">

          <button
            type="button"
            onClick={() =>
              navigate("/orders")
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-lg transition hover:bg-orange-600 active:scale-[0.98]"
          >
            <Package size={20} />
            View My Orders
            <ArrowRight size={19} />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/restaurant")
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-7 py-4 font-black text-orange-600 transition hover:bg-orange-50"
          >
            <ShoppingBag size={20} />
            Order More Food
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-7 py-4 font-black text-gray-700 shadow-sm transition hover:border-orange-400 hover:text-orange-500"
          >
            <Home size={20} />
            Back to Home
          </button>

        </div>

        {/* =================================================
            FOOTER MESSAGE
        ================================================= */}

        <div className="py-8 text-center">

          <p className="text-sm text-gray-400">
            Thank you for choosing{" "}
            <span className="font-black text-orange-500">
              BiteRush
            </span>{" "}
            
          </p>

        </div>

      </div>
    </section>
  );
}

export default OrderSuccess;
