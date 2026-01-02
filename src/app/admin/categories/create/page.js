"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  TagIcon,
  PhotoIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { showAlert } from "../../../../utils/sweetAlert";
import Sidebar from "../../../components/admin/Sidebar";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    metaTitle: "",
    metaDescription: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("status", formData.status);
      data.append("metaTitle", formData.metaTitle);
      data.append("metaDescription", formData.metaDescription);
      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create category");
      }

      showAlert("success", "Success", "Collection created successfully").then(
        () => {
          router.push("/admin/categories");
        }
      );
    } catch (error) {
      console.error("Operation failed", error);
      showAlert("error", "Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-3xl font-bold tracking-tight">
              Create New Collection
            </h2>
            <p className="text-gray-400 mt-1">
              Add a new product collection to the store.
            </p>
          </div>
        </header>

        <div className="w-full mx-auto">
          <div className="bg-[#111] border border-gray-900 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-900">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <TagIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Collection Information
                </h3>
                <p className="text-sm text-gray-400">
                  Enter the details for the new collection.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Collection Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <TagIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="e.g. Kitchen Knives"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Description
                  </label>
                  <div className="relative group">
                    <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                      <DocumentTextIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      placeholder="Describe the collection..."
                    />
                  </div>
                </div>

                {/* Image Upload Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Collection Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      id="image-upload"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      required={!imagePreview}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${imagePreview
                          ? "border-primary/50 bg-black"
                          : "border-gray-800 bg-black hover:bg-gray-900 hover:border-gray-700"
                        }`}
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full group overflow-hidden rounded-2xl">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain p-2"
                          />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="flex flex-col items-center text-white">
                              <PhotoIcon className="h-10 w-10 mb-2" />
                              <span className="text-sm font-bold uppercase tracking-wider">
                                Change Image
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-4 rounded-full bg-gray-900 mb-4 group-hover:bg-gray-800 transition-colors">
                            <PhotoIcon className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                          </div>
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-bold text-white">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* SEO Section */}
                <div className="pt-4 border-t border-gray-900">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center">
                    <GlobeAltIcon className="h-5 w-5 mr-2 text-primary" />
                    SEO Settings
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="SEO Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                        Meta Description
                      </label>
                      <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="block w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                        placeholder="SEO Description"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Status
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
                  disabled={loading}
                  className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-all text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
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
                      Creating...
                    </>
                  ) : (
                    "Create Collection"
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
