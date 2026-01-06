"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeftIcon,
    TagIcon,
    PhotoIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    CubeIcon,
    GlobeAltIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { showAlert } from "../../../../utils/sweetAlert";
import Sidebar from "../../../components/admin/Sidebar";
import TextEditor from "@/app/components/admin/TextEditor";

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // State for Images
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [hoverImage, setHoverImage] = useState(null);
    const [hoverImagePreview, setHoverImagePreview] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]); // Array of File objects
    const [galleryPreviews, setGalleryPreviews] = useState([]); // Array of strings (URLs)

    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        price: "",
        discount: "0",
        status: "active",
        description: "",
        features: "",
        specifications: "",
        materials: "",
        dimensions: "",
        usage: "",
        metaTitle: "",
        metaDescription: "",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            if (res.ok) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error("Failed to fetch categories");
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (field, content) => {
        setFormData((prev) => ({ ...prev, [field]: content }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleHoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHoverImage(file);
            setHoverImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Append new files
            setGalleryImages((prev) => [...prev, ...files]);
            // Append new previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index) => {
        setGalleryImages((prev) => prev.filter((_, i) => i !== index));
        setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic Validation
        if (!mainImage || !hoverImage) {
            showAlert("error", "Validation Error", "Please upload both Main and Hover images.");
            setLoading(false);
            return;
        }

        if (galleryImages.length < 2) {
            showAlert("error", "Validation Error", "Please upload at least 2 gallery images.");
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("category", formData.categoryId);
            data.append("price", formData.price);
            data.append("discount", formData.discount);
            data.append("status", formData.status);
            data.append("description", formData.description);
            data.append("features", formData.features);
            data.append("specifications", formData.specifications);
            data.append("materials", formData.materials);
            data.append("dimensions", formData.dimensions);
            data.append("usage", formData.usage);
            data.append("metaTitle", formData.metaTitle);
            data.append("metaDescription", formData.metaDescription);

            if (mainImage) data.append("mainImage", mainImage);
            if (hoverImage) data.append("hoverImage", hoverImage);

            galleryImages.forEach((file) => {
                data.append("galleryImages", file);
            });

            const res = await fetch("/api/admin/products", {
                method: "POST",
                body: data,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to create product");
            }

            showAlert("success", "Success", "Product created successfully").then(
                () => {
                    router.push("/admin/products");
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

            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen">
                <header className="mt-12 lg:mt-0 flex items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 p-2 rounded-full hover:bg-gray-900 transition-colors text-gray-400 hover:text-white group"
                    >
                        <ArrowLeftIcon className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Create New Product
                        </h2>
                        <p className="text-gray-400 mt-1">
                            Add a new product to your inventory.
                        </p>
                    </div>
                </header>

                <div className="w-full mx-auto max-w-5xl">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* 1. Basic Information */}
                        <div className="bg-[#111] border border-gray-900 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-900">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <CubeIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Basic Information</h3>
                                    <p className="text-sm text-gray-400">Name, Collection, and Pricing</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="block w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="e.g. Damascus Chef Knife"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Collection</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        required
                                        className="block w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    >
                                        <option value="">Select Collection</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="block w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="block w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Discount (%)</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                        className="block w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Media Section */}
                        <div className="bg-[#111] border border-gray-900 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-900">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <PhotoIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Product Images</h3>
                                    <p className="text-sm text-gray-400">Main, Hover, and Gallery Images</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Main Image */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Main Image (Required)</label>
                                    <div className="relative">
                                        <input type="file" onChange={handleMainImageChange} accept="image/*" className="hidden" id="main-upload" />
                                        <label htmlFor="main-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer hover:bg-gray-900/50 transition-all bg-black">
                                            {mainImagePreview ? (
                                                <img src={mainImagePreview} alt="Main Preview" className="h-full w-full object-contain rounded-2xl p-2" />
                                            ) : (
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                                                    <p className="mt-2 text-sm text-gray-400">Click to upload main image</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Hover Image */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Hover Image (Required)</label>
                                    <div className="relative">
                                        <input type="file" onChange={handleHoverImageChange} accept="image/*" className="hidden" id="hover-upload" />
                                        <label htmlFor="hover-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer hover:bg-gray-900/50 transition-all bg-black">
                                            {hoverImagePreview ? (
                                                <img src={hoverImagePreview} alt="Hover Preview" className="h-full w-full object-contain rounded-2xl p-2" />
                                            ) : (
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                                                    <p className="mt-2 text-sm text-gray-400">Click to upload hover image</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Gallery Images */}
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Gallery Images (Min 2)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {galleryPreviews.map((src, index) => (
                                            <div key={index} className="relative aspect-square border border-gray-800 rounded-xl overflow-hidden group">
                                                <img src={src} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-2 right-2 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <TrashIcon className="h-4 w-4 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-800 rounded-xl cursor-pointer hover:bg-gray-900/50 transition-all bg-black">
                                            <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="hidden" />
                                            <PlusIcon className="h-8 w-8 text-gray-500" />
                                            <span className="text-xs text-gray-500 mt-2">Add Images</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Detailed Description (Rich Text) */}
                        <div className="bg-[#111] border border-gray-900 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-900">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <DocumentTextIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Product Details</h3>
                                    <p className="text-sm text-gray-400">Rich text descriptions and specifications</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                <TextEditor label="Description" value={formData.description} onChange={(val) => handleEditorChange('description', val)} placeholder="Product main description..." />
                                <TextEditor label="Features" value={formData.features} onChange={(val) => handleEditorChange('features', val)} placeholder="Key features..." />
                                <TextEditor label="Specifications" value={formData.specifications} onChange={(val) => handleEditorChange('specifications', val)} placeholder="Technical specifications..." />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <TextEditor label="Materials" value={formData.materials} onChange={(val) => handleEditorChange('materials', val)} placeholder="Material details..." />
                                    <TextEditor label="Dimensions" value={formData.dimensions} onChange={(val) => handleEditorChange('dimensions', val)} placeholder="Product dimensions..." />
                                </div>

                                <TextEditor label="Usage" value={formData.usage} onChange={(val) => handleEditorChange('usage', val)} placeholder="Usage instructions..." />
                            </div>
                        </div>

                        <div className="bg-[#111] border border-gray-900 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-900">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <GlobeAltIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">SEO Settings</h3>
                                    <p className="text-sm text-gray-400">Search Engine Optimization</p>
                                </div>
                            </div>

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
                                    "Creating..."
                                ) : (
                                    "Create Product"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}





