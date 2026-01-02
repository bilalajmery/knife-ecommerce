"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { showAlert } from "../../../../../utils/sweetAlert";
import Sidebar from "../../../../components/admin/Sidebar";
import Loader from "../../../../components/Loader";

export default function EditAdminPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`/api/admin/admins`);
        const data = await res.json();

        if (res.ok) {
          const admin = data.admins.find((a) => a._id === id);
          if (admin) {
            setFormData({
              name: admin.name,
              email: admin.email,
              status: admin.status,
            });
          } else {
            showAlert("error", "Not Found", "Admin not found").then(() =>
              router.push("/admin/admins")
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdmin();
    }
  }, [id, router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update admin");
      }

      showAlert("success", "Success", "Admin updated successfully").then(() => {
        router.push("/admin/admins");
      });
    } catch (error) {
      console.error("Operation failed", error);
      showAlert("error", "Error", error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
        <header className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-900 transition-colors text-gray-400 hover:text-white group"
          >
            <ArrowLeftIcon className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Admin</h2>
            <p className="text-gray-400 mt-1">Update administrator details</p>
          </div>
        </header>

        <div className="w-full mx-auto">
          <div className="bg-[#111] border border-gray-900 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-900">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Account Information
                </h3>
                <p className="text-sm text-gray-400">
                  Update the personal details for this admin account.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Status Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Account Status
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CheckCircleIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-900 flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-all text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Admin"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
