"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductSlider({ title, products, link }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });

      // Update arrow visibility after scroll (approximate)
      setTimeout(() => {
        setShowLeftArrow(current.scrollLeft > 0);
        setShowRightArrow(
          current.scrollLeft < current.scrollWidth - current.clientWidth - 10
        );
      }, 300);
    }
  };

  return (
    <section className="py-20 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
            {title}
          </h2>
          {link && (
            <Link
              href={link}
              className="hidden md:block text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
            >
              View All &rarr;
            </Link>
          )}
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 text-white p-3 hover:bg-primary transition-all duration-300 ${
              !showLeftArrow ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          {/* Slider Container */}
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="min-w-[280px] md:min-w-[320px] snap-start"
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 text-white p-3 hover:bg-primary transition-all duration-300 ${
              !showRightArrow ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href={link || "#"}
            className="text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
