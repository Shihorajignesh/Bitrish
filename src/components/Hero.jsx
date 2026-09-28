import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  MapPin,
  Clock3,
  ShieldCheck,
  Star,
} from "lucide-react";

function Hero() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (e) => {
    e?.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    // Search page પર query મોકલશે
    navigate(`/search?query=${encodeURIComponent(value)}`);

    setSearch("");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gray-950">

      {/* =================================================
          BACKGROUND IMAGE
      ================================================= */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=85')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/30" />

      {/* =================================================
          DECORATION
      ================================================= */}

      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">

        <div className="w-full max-w-4xl">

          {/* Badge */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 backdrop-blur-md">

            <Star
              size={16}
              fill="currentColor"
            />

            #1 Food Delivery Experience

          </div>

          {/* Heading */}

          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">

            Delicious Food,

            <br />

            <span className="bg-linear-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Delivered Fast.
            </span>

          </h1>

          {/* Description */}

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg sm:leading-8">
            Discover delicious meals from the best restaurants
            around you. Order your favorite food and enjoy
            fresh, hot delivery right to your doorstep.
          </p>

          {/* =================================================
              SEARCH
          ================================================= */}

          <form
            onSubmit={handleSearch}
            className="mt-8 w-full max-w-2xl"
          >

            <div className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-2xl sm:flex-row sm:rounded-full">

              {/* Search Input */}

              <div className="flex min-w-0 flex-1 items-center">

                <Search
                  size={21}
                  className="ml-4 shrink-0 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search pizza, burger, pasta..."
                  aria-label="Search food"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
                />

              </div>

              {/* Search Button */}

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 font-bold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-300/30 sm:rounded-full"
              >
                <Search size={18} />
                Search
              </button>

            </div>

          </form>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">

            {/* Order Now */}

            <Link
              to="/restaurants"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-orange-500/40"
            >
              Order Now

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* View Restaurants */}

            <Link
              to="/restaurants"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-gray-900"
            >
              View Restaurants
            </Link>

          </div>

          {/* =================================================
              FEATURES
          ================================================= */}

          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Feature 1 */}

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                <Clock3 size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Fast Delivery
                </p>

                <p className="text-xs text-gray-300">
                  30 min delivery
                </p>
              </div>

            </div>

            {/* Feature 2 */}

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Safe & Fresh
                </p>

                <p className="text-xs text-gray-300">
                  Quality guaranteed
                </p>
              </div>

            </div>

            {/* Feature 3 */}

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Nearby Restaurants
                </p>

                <p className="text-xs text-gray-300">
                  Best food around you
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          BOTTOM FADE
      ================================================= */}

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-gray-50 to-transparent" />

    </section>
  );
}

export default Hero;