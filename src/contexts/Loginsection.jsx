import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ChefHat,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Loginsection() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!cleanEmail || !password) {
      setError("Please enter email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // =====================================================
    // FIREBASE LOGIN
    // =====================================================

    try {
      setLoading(true);

      const result = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      console.log("Firebase Login Success:", result.user.uid);

      setSuccess("Login successful! Welcome to BiteRush 🍔");

      // Firebase onAuthStateChanged in App.jsx
      // will detect this login automatically.

      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 500);
    } catch (err) {
      console.error("Firebase Login Error:", err);

      switch (err.code) {
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;

        case "auth/user-not-found":
          setError(
            "No account found with this email. Please sign up first."
          );
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;

        case "auth/too-many-requests":
          setError(
            "Too many login attempts. Please try again later."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email/Password login is not enabled in Firebase."
          );
          break;

        default:
          setError(
            err.message || "Login failed. Please try again."
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
      <div className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center">

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
              Welcome Back 👋
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Sign in to continue ordering delicious food.
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
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-bold text-slate-200"
              >
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-bold text-slate-200"
              >
                Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >

              {loading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={20} />

                  Sign In
                </>
              )}

            </button>

          </form>

          {/* SIGN UP */}

          <div className="mt-6 border-t border-slate-800 pt-6 text-center">

            <p className="text-sm text-slate-400">
              Don't have an account?
            </p>

            <Link
              to="/signup"
              className="mt-2 inline-block font-black text-orange-500 hover:text-orange-400"
            >
              Create Account
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}

export default Loginsection;