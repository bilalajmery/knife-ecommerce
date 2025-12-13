"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";

export default function ProductDetailPage({ params }) {
  // Mock product data - in a real app, you'd fetch this based on params.id
  const product = {
    id: 1,
    name: "Damascus Hunter",
    price: 129,
    originalPrice: 150,
    description:
      "Hand-forged with 67 layers of premium Damascus steel, this hunting knife is a masterpiece of craftsmanship. The blade features a stunning pattern and a razor-sharp edge that retains its sharpness through the toughest tasks. The handle is made from stabilized wood, offering a comfortable and secure grip.",
    features: [
      "67-layer Damascus Steel",
      "Stabilized Wood Handle",
      "Razor Sharp Edge",
      "Includes Leather Sheath",
      "Lifetime Warranty",
    ],
    images: [
      "/hero-knife.png",
      "/hero-tactical.png",
      "/hero-kitchen.png",
      "/hero-knife.png",
    ],
    category: "Hunting",
    sku: "DH-001",
    stock: "In Stock",
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Chef's Choice",
      price: 189,
      category: "Kitchen",
      image: "/hero-kitchen.png",
      hoverImage: "/hero-knife.png",
      badge: "Top Rated",
      originalPrice: 200,
    },
    {
      id: 3,
      name: "Tactical Ops",
      price: 89,
      category: "Tactical",
      image: "/hero-tactical.png",
      hoverImage: "/hero-kitchen.png",
      badge: "New",
    },
    {
      id: 4,
      name: "Bushcraft Pro",
      price: 145,
      category: "Outdoor",
      image: "/hero-knife.png",
      hoverImage: "/hero-tactical.png",
      badge: "Trending",
    },
    {
      id: 5,
      name: "Folding EDC",
      price: 65,
      category: "Everyday",
      image: "/hero-tactical.png",
      hoverImage: "/hero-knife.png",
      badge: "",
    },
    {
      id: 6,
      name: "Stealth Fighter",
      price: 210,
      category: "Tactical",
      image: "/hero-tactical.png",
      hoverImage: "/hero-knife.png",
      badge: "New Arrival",
    },
    {
      id: 7,
      name: "Santoku Master",
      price: 165,
      category: "Kitchen",
      image: "/hero-kitchen.png",
      hoverImage: "/hero-tactical.png",
      badge: "New Arrival",
    },
    {
      id: 8,
      name: "Rescue Tool",
      price: 55,
      category: "Emergency",
      image: "/hero-knife.png",
      hoverImage: "/hero-kitchen.png",
      badge: "New Arrival",
    },
    {
      id: 9,
      name: "Fillet Pro",
      price: 45,
      category: "Fishing",
      image: "/hero-kitchen.png",
      hoverImage: "/hero-knife.png",
      badge: "New Arrival",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={product.images[0]}
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
            {product.category} Series
          </p>
        </div>
      </div>

      <main className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.originalPrice > product.price && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square bg-gray-900 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === idx
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
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-sm text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded">
                {product.stock}
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Features List */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-400">
                    <svg
                      className="w-5 h-5 text-primary mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

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
              <button className="flex-1 bg-primary text-white font-bold uppercase tracking-widest py-4 px-8 rounded-md hover:bg-red-700 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
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
              <p>Category: {product.category}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Related Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-wider text-white mb-12">
            Related <span className="text-primary">Products</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
