import { Link } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
} from "react-icons/fa";

import { IoMdMail } from "react-icons/io";

import {
  ChefHat,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  ShoppingCart,
  Heart,
  Package,
  CreditCard,
  CheckCircle2,
  Search,
  Store,
  Tag,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";

// =====================================================
// Scroll To Top
// =====================================================

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// =====================================================
// Footer Component
// =====================================================

function Footer() {
  return (
    <footer className="bg-gray-950 text-white">

      {/* =================================================
          MAIN FOOTER
      ================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* =================================================
              BRAND
          ================================================== */}

          <div>

            {/* Logo */}

            <Link
              to="/"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2"
            >

              <ChefHat
                size={42}
                className="
                  text-orange-500
                  transition-all
                  duration-300
                  group-hover:rotate-6
                  group-hover:scale-110
                "
              />

              <span className="text-3xl font-bold tracking-tight">
                Bite
                <span className="text-orange-500">
                  Rush
                </span>
              </span>

            </Link>


            {/* Description */}

            <p className="mt-5 max-w-sm leading-7 text-gray-400">
              Your favorite food, delivered fast and fresh.
              Discover the best restaurants and enjoy delicious
              meals right at your doorstep.
            </p>


            {/* Social Media */}

            <div className="mt-6 flex gap-3">

              {/* Facebook */}

              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-800
                  text-gray-300
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-orange-500
                  hover:text-white
                  hover:shadow-lg
                  hover:shadow-orange-500/20
                "
              >
                <FaFacebookF size={15} />
              </a>


              {/* Instagram */}

              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-800
                  text-gray-300
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-orange-500
                  hover:text-white
                  hover:shadow-lg
                  hover:shadow-orange-500/20
                "
              >
                <FaInstagram size={16} />
              </a>


              {/* YouTube */}

              <a
                href="#"
                aria-label="YouTube"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-800
                  text-gray-300
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-orange-500
                  hover:text-white
                  hover:shadow-lg
                  hover:shadow-orange-500/20
                "
              >
                <FaYoutube size={16} />
              </a>

            </div>

          </div>


          {/* 
              EXPLORE
         */}

          <div>

            <h3 className="mb-6 text-xl font-bold">
              Explore
            </h3>


            <ul className="space-y-4">

              {/* Home */}

              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <ArrowRight size={15} />
                  Home
                </Link>
              </li>


              {/* Restaurants */}

              <li>
                <Link
                  to="/restaurants"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <Store size={17} />
                  Restaurants
                </Link>
              </li>


              {/* Offers */}

              <li>
                <Link
                  to="/offers"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <Tag size={17} />
                  Offers
                </Link>
              </li>


              {/* Search */}

              <li>
                <Link
                  to="/search"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <Search size={17} />
                  Search Food
                </Link>
              </li>


              {/* Cart */}

              <li>
                <Link
                  to="/cart"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <ShoppingCart size={17} />
                  My Cart
                </Link>
              </li>


              {/* Wishlist */}

              <li>
                <Link
                  to="/wishlist"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <Heart size={17} />
                  Wishlist
                </Link>
              </li>

            </ul>

          </div>


          {/* 
              MY ACCOUNT
          */}

          <div>

            <h3 className="mb-6 text-xl font-bold">
              My Account
            </h3>


            <ul className="space-y-4">

              {/* Login */}

              <li>
                <Link
                  to="/login"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <LogIn size={17} />
                  Login
                </Link>
              </li>


              {/* Signup */}

              <li>
                <Link
                  to="/signup"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <UserPlus size={17} />
                  Create Account
                </Link>
              </li>


              {/* Profile */}

              <li>
                <Link
                  to="/profile"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <User size={17} />
                  Profile
                </Link>
              </li>


              {/* Orders */}

              <li>
                <Link
                  to="/orders"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <Package size={17} />
                  My Orders
                </Link>
              </li>


              {/* Order Details */}

              <li>
                <Link
                  to="/order-detail"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  <Package size={17} />
                  Order Details
                </Link>
              </li>


              {/* Order Success */}

              <li>
                <Link
                  to="/order-success"
                  onClick={scrollToTop}
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-400
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:text-green-400
                  "
                >
                  <CheckCircle2 size={17} />
                  Order Success
                </Link>
              </li>

            </ul>

          </div>


          {/* 
              SERVICES + CONTACT
          */}

          <div>

            <h3 className="mb-6 text-xl font-bold">
              Services
            </h3>


            <div className="space-y-5">

              {/* Fast Delivery */}

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-orange-500/10 p-2.5">
                  <Truck
                    size={20}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h4 className="font-semibold">
                    Fast Delivery
                  </h4>

                  <p className="mt-1 text-sm text-gray-500">
                    Quick doorstep delivery
                  </p>
                </div>

              </div>


              {/* 24/7 Service */}

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-orange-500/10 p-2.5">
                  <Clock
                    size={20}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h4 className="font-semibold">
                    24/7 Service
                  </h4>

                  <p className="mt-1 text-sm text-gray-500">
                    Order anytime you want
                  </p>
                </div>

              </div>


              {/* Secure Payment */}

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-orange-500/10 p-2.5">
                  <ShieldCheck
                    size={20}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h4 className="font-semibold">
                    Secure Payment
                  </h4>

                  <p className="mt-1 text-sm text-gray-500">
                    Safe and secure checkout
                  </p>
                </div>

              </div>


              {/* Checkout */}

              <Link
                to="/checkout"
                onClick={scrollToTop}
                className="footer-link"
              >
                <CreditCard size={18} />
                Checkout
              </Link>


              {/* Payment */}

              <Link
                to="/payment"
                onClick={scrollToTop}
                className="footer-link"
              >
                <CreditCard size={18} />
                Payment
              </Link>

            </div>


            {/*
                CONTACT
           */}

            <div className="mt-8 border-t border-gray-800 pt-6">

              <h4 className="mb-5 font-semibold">
                Contact Us
              </h4>


              {/* Address */}

              <div className="mb-4 flex items-start gap-3">

                <FaMapMarkerAlt
                  className="mt-1 shrink-0 text-orange-500"
                />

                <p className="text-sm leading-6 text-gray-400">
                  Ahmedabad, Gujarat,
                  <br />
                  India
                </p>

              </div>


              {/* Phone */}

              <div className="mb-4 flex items-center gap-3">

                <FaPhoneAlt
                  className="shrink-0 text-orange-500"
                />

                <a
                  href="tel:+919773167442"
                  className="
                    text-sm
                    text-gray-400
                    transition
                    hover:text-orange-500
                  "
                >
                  +91 9773167442
                </a>

              </div>


              {/* Email */}

              <div className="flex items-center gap-3">

                <IoMdMail
                  className="shrink-0 text-orange-500"
                />

                <a
                  href="mailto:shihorasohile@gmail.com"
                  className="
                    break-all
                    text-sm
                    text-gray-400
                    transition
                    hover:text-orange-500
                  "
                >
                  shihorasohile@gmail.com
                </a>

              </div>

            </div>

          </div>

        </div>


        {/*
            BOTTOM FOOTER
        */}

        <div
          className="
            mt-14
            flex
            flex-col
            items-center
            justify-between
            gap-5
            border-t
            border-gray-800
            pt-7
            md:flex-row
          "
        >

          {/* Copyright */}

          <p className="text-center text-sm text-gray-500 md:text-left">
            © 2026 BiteRush. All Rights Reserved.
          </p>


          {/* Bottom Links */}

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-5
              text-sm
              text-gray-500
            "
          >

            <Link
              to="/"
              onClick={scrollToTop}
              className="transition hover:text-orange-500"
            >
              Home
            </Link>


            <Link
              to="/restaurants"
              onClick={scrollToTop}
              className="transition hover:text-orange-500"
            >
              Restaurants
            </Link>


            <Link
              to="/offers"
              onClick={scrollToTop}
              className="transition hover:text-orange-500"
            >
              Offers
            </Link>


            <Link
              to="/cart"
              onClick={scrollToTop}
              className="transition hover:text-orange-500"
            >
              Cart
            </Link>


            <Link
              to="/wishlist"
              onClick={scrollToTop}
              className="transition hover:text-orange-500"
            >
              Wishlist
            </Link>

          </div>

        </div>

      </div>


      {/*
          CUSTOM FOOTER STYLE
       */}

      <style>
        {`
          .footer-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: rgb(156 163 175);
            transition: all 300ms ease;
          }

          .footer-link:hover {
            color: rgb(249 115 22);
            transform: translateX(4px);
          }
        `}
      </style>

    </footer>
  );
}

export default Footer;