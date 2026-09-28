import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ChefHat,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

function Signupsection() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    // Only numbers for phone
    if (name === "phone") {
      finalValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // SIGNUP
  // =====================================================

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // =====================================================
    // REQUIRED
    // =====================================================

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    // =====================================================
    // NAME
    // =====================================================

    if (name.length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    // =====================================================
    // EMAIL
    // =====================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // =====================================================
    // PHONE
    // =====================================================

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    // =====================================================
    // PASSWORD
    // =====================================================

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    // =====================================================
    // CONFIRM PASSWORD
    // =====================================================

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let createdUser = null;

    try {
      setLoading(true);

      // =================================================
      // CREATE FIREBASE AUTH USER
      // =================================================

      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      createdUser = result.user;

      console.log(
        "Firebase User Created:",
        createdUser.uid
      );

      // =================================================
      // UPDATE FIREBASE DISPLAY NAME
      // =================================================

      await updateProfile(createdUser, {
        displayName: name,
      });

      // =================================================
      // CREATE FIRESTORE PROFILE
      // =================================================

      await setDoc(
        doc(db, "users", createdUser.uid),
        {
          uid: createdUser.uid,
          name: name,
          email: email,
          phone: phone,

          role: "customer",

          provider: "password",

          address: "",

          photo: "",

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      // =================================================
      // IMPORTANT
      // Firebase automatically logs user in after signup.
      //
      // But we want:
      //
      // Signup → Login Page
      //
      // So sign out here.
      // =================================================

      await signOut(auth);

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      // Clear form

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // =================================================
      // LOGIN PAGE
      // =================================================

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1000);

    } catch (err) {
      console.error(
        "Firebase Signup Error:",
        err
      );

      // =================================================
      // CLEANUP AUTH USER
      // =================================================

      if (
        createdUser &&
        err.code !== "auth/email-already-in-use"
      ) {
        try {
          await deleteUser(createdUser);
        } catch (deleteError) {
          console.error(
            "Cleanup Error:",
            deleteError
          );
        }
      }

      // =================================================
      // FIREBASE ERRORS
      // =================================================

      switch (err.code) {
        case "auth/email-already-in-use":
          setError(
            "An account with this email already exists."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/weak-password":
          setError(
            "Password is too weak. Use at least 6 characters."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email/Password authentication is not enabled in Firebase."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          setError(
            err.message ||
              "Unable to create account. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 pt-24">

      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">

        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

          {/* LOGO */}

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">

              <ChefHat size={32} />

            </div>

            <h1 className="mt-4 text-3xl font-black text-white">
              BiteRush
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Fast • Fresh • Delicious
            </p>

          </div>

          {/* TITLE */}

          <div className="mb-6">

            <h2 className="text-2xl font-black text-white">
              Create Account 🚀
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Join BiteRush and start ordering.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-semibold text-red-400">

              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>

            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm font-semibold text-green-400">

              <CheckCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <span>{success}</span>

            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSignup}
            className="space-y-4"
          >

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-200">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-200">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />

              </div>

            </div>

            {/* PHONE */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-200">
                Phone Number
              </label>

              <div className="relative">

                <Phone
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength={10}
                  autoComplete="tel"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-200">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 pl-11 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:text-orange-500"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-200">
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 pl-11 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:text-orange-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* SIGNUP BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >

              {loading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />

                  Create Account
                </>
              )}

            </button>

          </form>

          {/* LOGIN */}

          <div className="mt-6 border-t border-slate-800 pt-6 text-center">

            <p className="text-sm text-slate-400">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-2 inline-block font-black text-orange-500 hover:text-orange-400"
            >
              Sign In
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Signupsection;