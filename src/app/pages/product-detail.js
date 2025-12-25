"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";

import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product, quantity);
      // Optional: Add a toast notification here
      // alert(`Added ${quantity} ${product.name} to cart`);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // params is already resolved in the parent page
        const slug = params?.slug;

        if (!slug) {
          console.error("CLIENT: No slug provided in params");
          setError("Product not found");
          setLoading(false);
          return;
        }

        console.log("CLIENT: Fetching product with slug:", slug);
        const url = `/api/products/${slug}`;
        console.log("CLIENT: Fetch URL:", url);

        const response = await fetch(url);
        console.log("CLIENT: Fetch response status:", response.status);

        const data = await response.json();
        console.log("CLIENT: Fetch data success:", data.success);

        if (data.success) {
          setProduct(data.product);
          // Set initial image if gallery exists
          if (data.product.galleryImages && data.product.galleryImages.length > 0) {
            // Ensure main image is also included or handled
            // If galleryImages doesn't include mainImage, we might want to combine them or just use gallery
          }
        } else {
          setError(data.message || "Failed to load product");
        }
      } catch (err) {
        setError("An error occurred while fetching the product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  // Fetch related products when product is loaded
  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      try {
        const categoryId = product.category?._id || product.category; // Handle populated or unpopulated
        if (!categoryId) return;

        const res = await fetch(`/api/products?category=${categoryId}&exclude=${product._id}&limit=4`);
        const data = await res.json();

        if (data.success) {
          setRelatedProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch related products", err);
      }
    };

    fetchRelated();
  }, [product]);

  // Determine available tabs based on product data (safe to run always, empty if no product)
  const availableTabs = product ? [
    { id: 'specifications', label: 'Specifications', content: product.specifications },
    { id: 'materials', label: 'Materials', content: product.materials },
    { id: 'dimensions', label: 'Dimensions', content: product.dimensions },
    { id: 'usage', label: 'Usage', content: product.usage },
  ].filter(tab => tab.content) : [];

  // Set active tab to first available on load, if not already set correctly
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  const [relatedProducts, setRelatedProducts] = useState([]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white font-sans flex items-center justify-center">
        <Navbar />
        <div className="animate-pulse">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-black min-h-screen text-white font-sans">
        <Navbar />
        <div className="py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-8">{error || "The requested product does not exist."}</p>
          <Link href="/shop" className="bg-primary px-6 py-3 rounded text-white font-bold uppercase">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate discount if needed
  const discountPercentage = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Use gallery images or fallback to main image
  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.mainImage, product.hoverImage].filter(Boolean);



  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images[0] || "/placeholder.png"}
            alt={product.name}
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
            <Link href="/shop" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <span className="mx-3 text-gray-600">/</span>
            <span className="text-white font-bold">{product.name}</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            {product.name}
          </h1>
          <p className="text-primary font-bold uppercase tracking-widest text-lg">
            {product.category?.name || "Collection"} Series
          </p>
        </div>
      </div>

      <main className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <Image
                src={images[selectedImage] || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {/* Using same discount logic as Product Card */}
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                  {product.discount}% OFF
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square bg-gray-900 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === idx
                    ? "border-primary"
                    : "border-transparent hover:border-gray-700"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-white">
                ${(product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price).toFixed(2)}
              </span>
              {(product.originalPrice || (product.discount > 0 ? product.price : null)) && (
                <span className="text-xl text-gray-500 line-through">
                  ${(product.originalPrice || product.price).toFixed(2)}
                </span>
              )}
              <span className="text-sm text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded">
                In Stock
              </span>
            </div>

            {product.status !== "active" && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-6 font-bold uppercase tracking-wider text-center">
                This product is currently unavailable
              </div>
            )}

<div className="max-w-lg overflow-hidden">            
  <div
  className="text-gray-300 leading-relaxed mb-8 prose prose-invert"
  dangerouslySetInnerHTML={{ __html: product.description }}
/></div>

            {/* Features List - Rendered as HTML - HIDDEN IF EMPTY */}
            {product.features && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                  Key Features
                </h3>
                <div
                  className="text-gray-400 prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.features }}
                />
              </div>
            )}

            <div className="border-t border-gray-800 my-8"></div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-700 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-3 text-white font-bold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white font-bold uppercase tracking-widest py-4 px-8 rounded-md hover:bg-red-700 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Add to Cart
              </button>
              {/* Wishlist Button */}
              <button className="p-4 border border-gray-700 rounded-md hover:border-primary hover:text-primary transition-colors text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            <div className="text-xs text-gray-500 space-y-2">
              <p>SKU: {product.sku}</p>
              <p>Collection: {product.category?.name || "Uncategorized"}</p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs - ONLY SHOW IF TABS EXIST */}
        {availableTabs.length > 0 && (
          <div className="mb-20">
            <div className="border-b border-gray-800 mb-8 overflow-x-auto">
              <nav className="flex space-x-8 min-w-max">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-400 hover:text-white hover:border-gray-700"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="min-h-[200px] text-gray-300 leading-relaxed">
              {/* Render content of active tab */}
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: availableTabs.find(t => t.id === activeTab)?.content || "" }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Related Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-wider text-white mb-12">
            Related <span className="text-primary">Products</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
