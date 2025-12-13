"use client";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, className = "" }) {
  // Calculate discount percentage if not provided but original price exists
  const discountPercentage =
    product.discount ||
    (product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0);

  return (
    <div className={`group/card relative ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-4">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          {/* Main Image */}
          <div className="absolute inset-0 transition-opacity duration-500 z-10 group-hover/card:opacity-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Hover Image */}
          <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover/card:opacity-100 z-10">
            <Image
              src={product.hoverImage || product.image || "/placeholder.png"}
              alt={`${product.name} hover`}
              fill
              className="object-cover scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>

        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-red-600 text-white shadow-sm">
              -{discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-600 text-white shadow-sm">
              NEW
            </span>
          )}
          {product.badge && !product.isNew && !discountPercentage && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-black text-white shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Action Buttons - Top Right */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          {/* Wishlist Button */}
          <button
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-all duration-300 opacity-0 group-hover/card:opacity-100 translate-x-4 group-hover/card:translate-x-0 shadow-sm"
            title="Add to Wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>

          {/* Add to Cart Button */}
          <button
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/card:opacity-100 translate-x-4 group-hover/card:translate-x-0 shadow-sm delay-75"
            title="Add to Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {product.category || "Knives"}
            </p>
            <h3 className="text-sm font-medium text-gray-900 truncate group-hover/card:text-primary transition-colors">
              <Link href={`/product/${product.id}`}>{product.name}</Link>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-gray-900 group-hover/card:text-primary transition-colors">
            ${product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
