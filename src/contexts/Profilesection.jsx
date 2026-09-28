import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Pencil,
  Save,
  X,
  LogOut,
  ShoppingBag,
  Heart,
  ArrowLeft,
} from "lucide-react";

const PROFILE_KEY = "biteRushProfile";
const LOGIN_KEY = "isLoggedIn";

const defaultProfile = {
  name: "BiteRush User",
  email: "",
  phone: "",
  address: "",
  photo: "",
};

function Profilesection() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(defaultProfile);

  const [orders, setOrders] = useState(0);
  const [wishlist, setWishlist] = useState(0);

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    if (savedProfile) {
      const data = JSON.parse(savedProfile);

      setProfile(data);
      setTempProfile(data);
    }

    const savedOrders = localStorage.getItem("orders");
    const savedWishlist = localStorage.getItem("wishlist");

    if (savedOrders) {
      const orderData = JSON.parse(savedOrders);
      setOrders(Array.isArray(orderData) ? orderData.length : 0);
    }

    if (savedWishlist) {
      const wishlistData = JSON.parse(savedWishlist);
      setWishlist(Array.isArray(wishlistData) ? wishlistData.length : 0);
    }
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTempProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PHOTO CHANGE
  // =========================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image below 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setTempProfile((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = () => {
    if (!tempProfile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!tempProfile.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (tempProfile.phone && !/^[0-9]{10}$/.test(tempProfile.phone)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(tempProfile)
    );

    setProfile(tempProfile);
    setEditMode(false);

    alert("Profile updated successfully! 🎉");
  };

  // =========================
  // CANCEL
  // =========================
  const handleCancel = () => {
    setTempProfile(profile);
    setEditMode(false);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem(LOGIN_KEY);

    navigate("/login");
  };

  // =========================
  // PROFILE COMPLETION
  // =========================
  const fields = [
    profile.name,
    profile.email,
    profile.phone,
    profile.address,
    profile.photo,
  ];

  const completed = fields.filter(
    (item) => item && item.trim?.() !== ""
  ).length;

  const completion = Math.round((completed / fields.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 pb-10">

      {/* ================= HEADER ================= */}
      <div className="bg-linear-to-r from-orange-500 via-red-500 to-pink-500 px-4 py-8 text-white">

        <div className="mx-auto max-w-5xl">

          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm backdrop-blur hover:bg-white/30"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="mt-1 text-white/90">
            Manage your BiteRush account
          </p>

        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="mx-auto -mt-6 max-w-5xl px-4">

        {/* PROFILE CARD */}
        <div className="rounded-2xl bg-white p-6 shadow-xl">

          <div className="flex flex-col items-center gap-6 md:flex-row">

            {/* PHOTO */}
            <div className="relative">

              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-linear-to-br from-orange-400 to-red-500 shadow-lg">

                {tempProfile.photo ? (
                  <img
                    src={tempProfile.photo}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={55} className="text-white" />
                )}

              </div>

              {editMode && (
                <>
                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-orange-500 p-2 text-white shadow-lg hover:bg-orange-600"
                  >
                    <Camera size={18} />
                  </label>

                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </>
              )}

            </div>

            {/* NAME */}
            <div className="flex-1 text-center md:text-left">

              <h2 className="text-2xl font-bold text-gray-800">
                {profile.name || "BiteRush User"}
              </h2>

              <p className="mt-1 text-gray-500">
                {profile.email || "Add your email"}
              </p>

              <div className="mt-3 inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
                BiteRush Customer
              </div>

            </div>

            {/* EDIT */}
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                <Pencil size={18} />
                Edit Profile
              </button>
            )}

          </div>

        </div>

        {/* ================= STATS ================= */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl bg-white p-5 text-center shadow">
            <ShoppingBag
              className="mx-auto text-orange-500"
              size={28}
            />

            <h3 className="mt-2 text-2xl font-bold">
              {orders}
            </h3>

            <p className="text-sm text-gray-500">
              Orders
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-center shadow">
            <Heart
              className="mx-auto text-red-500"
              size={28}
            />

            <h3 className="mt-2 text-2xl font-bold">
              {wishlist}
            </h3>

            <p className="text-sm text-gray-500">
              Wishlist
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-center shadow">
            <MapPin
              className="mx-auto text-green-500"
              size={28}
            />

            <h3 className="mt-2 text-2xl font-bold">
              {profile.address ? "✓" : "—"}
            </h3>

            <p className="text-sm text-gray-500">
              Address
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-center shadow">

            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              %
            </div>

            <h3 className="mt-2 text-2xl font-bold">
              {completion}%
            </h3>

            <p className="text-sm text-gray-500">
              Complete
            </p>

          </div>

        </div>

        {/* ================= PROFILE FORM ================= */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Personal Information
              </h2>

              <p className="text-sm text-gray-500">
                Your basic account information
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>

              {editMode ? (
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />

                  <input
                    type="text"
                    name="name"
                    value={tempProfile.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-orange-500"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-3 text-gray-700">
                  {profile.name || "Not added"}
                </div>
              )}

            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>

              {editMode ? (
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />

                  <input
                    type="email"
                    name="email"
                    value={tempProfile.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-orange-500"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-3 text-gray-700">
                  {profile.email || "Not added"}
                </div>
              )}

            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone
              </label>

              {editMode ? (
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={tempProfile.phone}
                    onChange={handleChange}
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-orange-500"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-3 text-gray-700">
                  {profile.phone || "Not added"}
                </div>
              )}

            </div>

            {/* ADDRESS */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Delivery Address
              </label>

              {editMode ? (
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />

                  <textarea
                    name="address"
                    value={tempProfile.address}
                    onChange={handleChange}
                    placeholder="Enter delivery address"
                    rows="3"
                    className="w-full resize-none rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-orange-500"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-3 text-gray-700">
                  {profile.address || "Not added"}
                </div>
              )}

            </div>

          </div>

          {/* SAVE BUTTONS */}
          {editMode && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600"
              >
                <Save size={18} />
                Save Changes
              </button>

              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
              >
                <X size={18} />
                Cancel
              </button>

            </div>
          )}

        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">

            <button
              onClick={() => navigate("/restaurants")}
              className="rounded-xl border p-4 text-left transition hover:border-orange-400 hover:bg-orange-50"
            >
              <ShoppingBag
                className="text-orange-500"
                size={25}
              />

              <p className="mt-2 font-semibold">
                Order Food
              </p>

              <p className="text-xs text-gray-500">
                Explore restaurants
              </p>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="rounded-xl border p-4 text-left transition hover:border-orange-400 hover:bg-orange-50"
            >
              <ShoppingBag
                className="text-orange-500"
                size={25}
              />

              <p className="mt-2 font-semibold">
                My Cart
              </p>

              <p className="text-xs text-gray-500">
                View your cart
              </p>
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="rounded-xl border p-4 text-left transition hover:border-red-400 hover:bg-red-50"
            >
              <Heart
                className="text-red-500"
                size={25}
              />

              <p className="mt-2 font-semibold">
                Wishlist
              </p>

              <p className="text-xs text-gray-500">
                Saved foods
              </p>
            </button>

            <button
              onClick={() => navigate("/offers")}
              className="rounded-xl border p-4 text-left transition hover:border-green-400 hover:bg-green-50"
            >
              <span className="text-2xl">🎁</span>

              <p className="mt-2 font-semibold">
                Offers
              </p>

              <p className="text-xs text-gray-500">
                Save more money
              </p>
            </button>

          </div>

        </div>

        {/* ================= LOGOUT ================= */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profilesection;