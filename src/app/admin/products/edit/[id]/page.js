"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeftIcon,
    TagIcon,
    PhotoIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    CubeIcon,
    TrashIcon,
    GlobeAltIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { showAlert, showConfirm } from "../../../../../utils/sweetAlert";
import Sidebar from "../../../../components/admin/Sidebar";
import TextEditor from "@/app/components/admin/TextEditor";

export default function EditProductPage({ params }) {
    const router = useRouter();
    // Unwrap params using React.use() or await (Next.js 15+ compatible)
    // Since we are in a client component, we receive params as a promise in newer versions or object in older.
    // We'll treat it as a promise-like or object based on recent Next.js changes, but simpler to just use it if it's passed directly 
    // or use `use` hook if it's a promise. API for `page.js` props in Next 15 is `params` is a Promise.
    // In Next 14 it was an object. The codebase seems to be Next 16 based on package.json "next": "16.0.10".
    // So params is a PROMISE.

    const { id } = use(params);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState([]);

    // State for Images
    const [mainImage, setMainImage] = useState(null); // File
    const [mainImagePreview, setMainImagePreview] = useState(null); // URL
    const [hoverImage, setHoverImage] = useState(null); // File
    const [hoverImagePreview, setHoverImagePreview] = useState(null); // URL

    const [galleryImages, setGalleryImages] = useState([]); // New Files to upload
    const [galleryPreviews, setGalleryPreviews] = useState([]); // Previews of new files
    const [existingGallery, setExistingGallery] = useState([]); // URLs of existing images

    const [resetGallery, setResetGallery] = useState(false);

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
        fetchProduct();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            if (res.ok) setCategories(data.categories);
        } catch (error) {
            console.error("Failed to fetch categories");
        }
    };

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/admin/products/${id}`);
            const data = await res.json();
            if (res.ok) {
                const p = data.product;
                setFormData({
                    name: p.name,
                    categoryId: p.category?._id || p.category,
                    price: p.price,
                    discount: p.discount,
                    status: p.status,
                    description: p.description || "",
                    features: p.features || "",
                    specifications: p.specifications || "",
                    materials: p.materials || "",
                    dimensions: p.dimensions || "",
                    usage: p.usage || "",
                    metaTitle: p.metaTitle || "",
                    metaDescription: p.metaDescription || "",
                });
                setMainImagePreview(p.mainImage);
                setHoverImagePreview(p.hoverImage);
                setExistingGallery(p.galleryImages || []);
            } else {
                showAlert("error", "Error", "Product not found");
                router.push("/admin/products");
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
            showAlert("error", "Error", "Failed to load product");
        } finally {
            setFetching(false);
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
            setGalleryImages((prev) => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeNewGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleResetGalleryToggle = () => {
        if (!resetGallery) {
            showConfirm("Reset Gallery?", "This will remove all existing gallery images upon save. You must upload at least 2 new images.").then((res) => {
                if (res.isConfirmed) {
                    setResetGallery(true);
                }
            });
        } else {
            setResetGallery(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        const totalImages = (resetGallery ? 0 : existingGallery.length) + galleryImages.length;
        if (totalImages < 2) {
            showAlert("error", "Validation Error", `Product must have at least 2 gallery images. Current count: ${totalImages}`);
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

            if (resetGallery) {
                data.append("resetGallery", "true");
            }

            if (mainImage) data.append("mainImage", mainImage);
            if (hoverImage) data.append("hoverImage", hoverImage);

            galleryImages.forEach((file) => {
                data.append("galleryImages", file);
            });

            const res = await fetch(`/api/admin/products/${id}`, {
                method: "PUT",
                body: data,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to update product");
            }

            showAlert("success", "Success", "Product updated successfully").then(
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

    if (fetching) {
        return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading Product...</div>;
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
                        <h2 className="text-3xl font-bold tracking-tight">
                            Edit Product
                        </h2>
                        <p className="text-gray-400 mt-1">
                            Update product details and inventory.
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
                                    <p className="text-sm text-gray-400">Name, Category, and Pricing</p>
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
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        required
                                        className="block w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    >
                                        <option value="">Select Category</option>
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
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Main Image</label>
                                    <div className="relative">
                                        <input type="file" onChange={handleMainImageChange} accept="image/*" className="hidden" id="main-upload" />
                                        <label htmlFor="main-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer hover:bg-gray-900/50 transition-all bg-black">
                                            {mainImagePreview ? (
                                                <img src={mainImagePreview} alt="Main Preview" className="h-full w-full object-contain rounded-2xl p-2" />
                                            ) : (
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Hover Image */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Hover Image</label>
                                    <div className="relative">
                                        <input type="file" onChange={handleHoverImageChange} accept="image/*" className="hidden" id="hover-upload" />
                                        <label htmlFor="hover-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer hover:bg-gray-900/50 transition-all bg-black">
                                            {hoverImagePreview ? (
                                                <img src={hoverImagePreview} alt="Hover Preview" className="h-full w-full object-contain rounded-2xl p-2" />
                                            ) : (
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Gallery Images */}
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Gallery Images</label>
                                        <button type="button" onClick={handleResetGalleryToggle} className={`text-xs font-bold uppercase tracking-wider ${resetGallery ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                                            {resetGallery ? "Undo Reset" : "Reset Gallery"}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {!resetGallery && existingGallery.map((src, index) => (
                                            <div key={`existing-${index}`} className="relative aspect-square border border-gray-800 rounded-xl overflow-hidden group">
                                                <img src={src} alt={`Existing Gallery ${index}`} className="w-full h-full object-cover opacity-75" />
                                                <div className="absolute top-2 right-2 bg-black/50 p-1 rounded text-xs text-white">Existing</div>
                                            </div>
                                        ))}

                                        {galleryPreviews.map((src, index) => (
                                            <div key={`new-${index}`} className="relative aspect-square border border-gray-800 rounded-xl overflow-hidden group">
                                                <img src={src} alt={`New Gallery ${index}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeNewGalleryImage(index)} className="absolute top-2 right-2 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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
                                    <p className="text-sm text-gray-400">Update Search Engine Optimization</p>
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
                                    "Updating..."
                                ) : (
                                    "Update Product"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}
