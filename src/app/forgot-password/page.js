"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("Email sent! Check your inbox for reset instructions.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-knife.png"
            alt="Forgot Password Header"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex justify-center items-center text-sm text-gray-400 mb-6 uppercase tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-3 text-gray-600">/</span>
            <span className="text-white font-bold">Forgot Password</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Reset <span className="text-primary">Password</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Enter your email to receive reset instructions.
          </p>
        </div>
      </div>

      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24 flex justify-center">
        <div className="w-full max-w-md space-y-8 bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg text-sm text-center">
                {message}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-black border border-gray-800 rounded-lg placeholder-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-lg text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
