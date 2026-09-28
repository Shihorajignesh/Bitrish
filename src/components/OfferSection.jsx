import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tag,
  Gift,
  AlarmClock,
  CircleArrowRight,
  Copy,
  Check,
  Truck,
  Percent,
  ShoppingBag,
} from "lucide-react";
import { FaHotjar } from "react-icons/fa";
import { motion } from "framer-motion";

/* =========================================================
   OFFER DATA
========================================================= */

const offers = [
  {
    id: 1,
    title: "50% OFF",
    subtitle: "On Your First Order",
    code: "WELCOME50",
    description: "Get 50% off on your first food order.",
    condition: "Maximum discount ₹150",
    color: "from-orange-500 to-red-500",
    icon: Gift,
    discountType: "percentage",
    discountValue: 50,
  },

  {
    id: 2,
    title: "Free Delivery",
    subtitle: "Above ₹299",
    code: "FREEDEL",
    description: "Enjoy free delivery on orders above ₹299.",
    condition: "Minimum order ₹299",
    color: "from-green-500 to-emerald-600",
    icon: Truck,
    discountType: "delivery",
    discountValue: 0,
  },

  {
    id: 3,
    title: "Buy 1 Get 1",
    subtitle: "Selected Restaurants",
    code: "BOGO",
    description: "Buy one selected item and get another free.",
    condition: "Selected restaurants only",
    color: "from-purple-500 to-pink-500",
    icon: AlarmClock,
    discountType: "bogo",
    discountValue: 1,
  },
];

/* =========================================================
   OFFER SECTION
========================================================= */

function OfferSection() {
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState("");

  /* =======================================================
     COPY COUPON
  ======================================================= */

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);
    } catch (error) {
      console.error("Unable to copy coupon:", error);

      /* Fallback for older browsers */
      try {
        const textArea = document.createElement("textarea");

        textArea.value = code;

        document.body.appendChild(textArea);

        textArea.select();

        document.execCommand("copy");

        document.body.removeChild(textArea);

        setCopiedCode(code);

        setTimeout(() => {
          setCopiedCode("");
        }, 2000);
      } catch {
        alert(`Coupon Code: ${code}`);
      }
    }
  };

  /* =======================================================
     ORDER NOW
  ======================================================= */

  const handleOrderNow = (offer) => {
    /*
      Coupon code temporary localStorage માં રાખીએ છીએ.
      Checkout page આ code read કરી શકે છે.
    */

    localStorage.setItem(
      "selectedOffer",
      JSON.stringify({
        id: offer.id,
        code: offer.code,
        title: offer.title,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
      })
    );

    window.dispatchEvent(new Event("offerUpdated"));

    /*
      તમારા project માં /restaurant route હોય
      તો user ત્યાં જશે.
    */

    navigate("/restaurant");
  };

  return (
    <section className="relative overflow-hidden bg-orange-50 py-16 sm:py-20">
      {/* ===================================================
          BACKGROUND DECORATION
      =================================================== */}

      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-red-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-5">

        {/* =================================================
            HEADING
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-14"
        >
          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-sm font-bold text-orange-600 shadow-sm">
            <FaHotjar
              size={18}
              className="animate-pulse text-orange-500"
            />

            Today's Best Deals
          </div>

          {/* Heading */}

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
            Exclusive{" "}
            <span className="text-orange-500">
              Offers
            </span>
          </h2>

          {/* Description */}

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Enjoy exciting discounts, free delivery and
            exclusive food offers. Grab your favourite deal
            before it expires!
          </p>
        </motion.div>

        {/* =================================================
            OFFER CARDS
        ================================================= */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, index) => {
            const Icon = offer.icon;

            const isCopied = copiedCode === offer.code;

            return (
              <motion.div
                key={offer.id}
                initial={{
                  opacity: 0,
                  y: 60,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                whileHover={{
                  y: -8,
                }}
                className={`group relative overflow-hidden rounded-3xl bg-linear-to-r ${offer.color} p-6 text-white shadow-xl transition-shadow duration-300 hover:shadow-2xl sm:p-8`}
              >
                {/* =================================================
                    DECORATIVE CIRCLES
                ================================================= */}

                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />

                <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-black/5" />

                {/* =================================================
                    ICON
                ================================================= */}

                <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <Icon size={30} />
                </div>

                {/* =================================================
                    OFFER TITLE
                ================================================= */}

                <div className="relative pr-16">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-white/80">
                    Limited Offer
                  </p>

                  <h3 className="text-3xl font-black sm:text-4xl">
                    {offer.title}
                  </h3>

                  <p className="mt-2 text-base font-semibold text-white/90 sm:text-lg">
                    {offer.subtitle}
                  </p>
                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <p className="relative mt-5 max-w-sm text-sm leading-6 text-white/80">
                  {offer.description}
                </p>

                {/* =================================================
                    CONDITION
                ================================================= */}

                <div className="relative mt-4 flex items-center gap-2 text-xs font-semibold text-white/80">
                  <Percent size={15} />

                  <span>{offer.condition}</span>
                </div>

                {/* =================================================
                    COUPON
                ================================================= */}

                <div className="relative mt-7">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                    Coupon Code
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(offer.code)
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-white/50 bg-white/10 px-4 py-3 text-left backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                    aria-label={`Copy coupon ${offer.code}`}
                  >
                    <span className="font-black tracking-[2px] sm:text-lg">
                      {offer.code}
                    </span>

                    {isCopied ? (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-white">
                        <Check size={17} />
                        Copied!
                      </span>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-white/80">
                        <Copy size={16} />
                        Copy
                      </span>
                    )}
                  </button>
                </div>

                {/* =================================================
                    ORDER BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    handleOrderNow(offer)
                  }
                  className="relative mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-gray-900 shadow-lg transition duration-300 hover:scale-[1.02] hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  <ShoppingBag size={19} />

                  Order Now

                  <CircleArrowRight
                    size={21}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                {/* =================================================
                    FOOTER TEXT
                ================================================= */}

                <p className="relative mt-4 text-center text-xs text-white/60">
                  *Terms & conditions apply
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          viewport={{
            once: true,
          }}
          className="mt-10 text-center"
        >
          <button
            type="button"
            onClick={() => navigate("/restaurant")}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-orange-500 hover:shadow-orange-200"
          >
            <ShoppingBag size={19} />

            Explore Restaurants

            <CircleArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default OfferSection;
