"use client";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, className = "" }) {
  return (
    <div className={`group/card relative bg-transparent ${className}`}>
      {/* Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-900 rounded-sm mb-4">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-white text-black shadow-lg">
              {product.badge}
            </span>
          </div>
        )}

        {/* Images */}
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          {/* Primary Image */}
          <div className="absolute inset-0 transition-opacity duration-500 ease-in-out z-10 group-hover/card:opacity-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-800 text-gray-600">
                NO IMAGE
              </div>
            )}
          </div>

          {/* Secondary Image (Hover) */}
          <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover/card:opacity-100 z-10">
            {product.hoverImage ? (
              <Image
                src={product.hoverImage}
                alt={`${product.name} hover`}
                fill
                className="object-cover scale-105"
              />
            ) : (
              // Fallback if no hover image is provided, just show the main one (or a placeholder)
              <Image
                src={product.image || "/hero-knife.png"}
                alt={product.name}
                fill
                className="object-cover scale-105"
              />
            )}
          </div>
        </Link>

        {/* Quick Add Button (appears on hover) */}
        <button className="absolute bottom-4 right-4 z-20 bg-white text-black p-3 rounded-full shadow-xl translate-y-12 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider truncate">
          <Link
            href={`/product/${product.id}`}
            className="hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-xs">
            {product.category || "Knives"}
          </p>
          <span className="text-sm font-bold text-white">${product.price}</span>
        </div>
      </div>
    </div>
  );
}
