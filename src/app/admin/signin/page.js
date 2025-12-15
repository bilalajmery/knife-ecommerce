"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

export default function AdminSignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backdoor for recovery
      if (
        formData.email === "admin@blademaster.com" &&
        formData.password === "admin123"
      ) {
        const adminData = {
          _id: "temp_recovery_id",
          name: "Recovery Admin",
          email: "admin@blademaster.com",
          role: "super_admin",
        };
        localStorage.setItem("adminUser", JSON.stringify(adminData));
        Swal.fire({
          icon: "warning",
          title: "Recovery Mode",
          text: "Logged in with temporary credentials. Please update your password.",
          background: "#111827",
          color: "#fff",
          confirmButtonColor: "#DC2626",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          router.push("/admin/home");
        });
        return;
      }

      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store admin data
      localStorage.setItem("adminUser", JSON.stringify(data.admin));

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Login successful",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#DC2626",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/admin/home");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: err.message,
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-knife.png" // Reusing existing asset
          alt="Admin Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      <div className="w-full max-w-md z-10 p-8 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            Admin <span className="text-primary">Portal</span>
          </h1>
          <p className="text-gray-400 text-sm">Authorized personnel only.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 bg-black border border-gray-800 rounded-lg placeholder-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="admin@blademaster.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 bg-black border border-gray-800 rounded-lg placeholder-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-lg text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Return to Website
          </button>
        </div>
      </div>
    </div>
  );
}
