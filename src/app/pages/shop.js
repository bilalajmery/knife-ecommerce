"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";

// Mock Data for Shop
const allProducts = [
  {
    id: 1,
    name: "Damascus Hunter",
    price: 129,
    category: "Hunting",
    image: "/hero-knife.png",
    hoverImage: "/hero-tactical.png",
    badge: "Best Seller",
    originalPrice: 150,
  },
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
    badge: "",
  },
  {
    id: 10,
    name: "Cleaver Beast",
    price: 110,
    category: "Kitchen",
    image: "/hero-tactical.png",
    hoverImage: "/hero-knife.png",
    badge: "",
  },
  {
    id: 11,
    name: "Survival Master",
    price: 135,
    category: "Outdoor",
    image: "/hero-knife.png",
    hoverImage: "/hero-tactical.png",
    badge: "Popular",
  },
  {
    id: 12,
    name: "Combat Elite",
    price: 195,
    category: "Tactical",
    image: "/hero-tactical.png",
    hoverImage: "/hero-knife.png",
    badge: "Elite",
  },
];

const categories = [
  "All",
  "Hunting",
  "Kitchen",
  "Tactical",
  "Outdoor",
  "Everyday",
];

const ITEMS_PER_PAGE = 9;

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category Filter
    if (activeCategory !== "All") {
      result = result.filter((product) => product.category === activeCategory);
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Price Filter
    if (minPrice) {
      result = result.filter((product) => product.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    // Discount Filter
    if (onlyDiscounted) {
      result = result.filter(
        (product) =>
          product.originalPrice && product.originalPrice > product.price
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "oldest":
        result.sort((a, b) => a.id - b.id);
        break;
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [activeCategory, searchQuery, minPrice, maxPrice, onlyDiscounted, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, minPrice, maxPrice, onlyDiscounted, sortBy]);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-tactical.png"
            alt="Shop Header"
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
            <span className="text-white font-bold">Shop</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Shop <span className="text-primary">Collection</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Explore our premium range of hand-crafted blades, designed for
            performance and durability.
          </p>
        </div>
      </div>

      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-1/4 space-y-8 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            {/* Search */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Search
              </h3>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block w-full text-left text-sm transition-colors ${
                      activeCategory === cat
                        ? "text-primary font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Price Range
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Discount Checkbox */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-primary rounded border-gray-800 bg-gray-900 focus:ring-primary focus:ring-offset-black"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  Only Discounted
                </span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:w-3/4">
            {/* Top Bar: Mobile Filter Toggle & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <button
                className="lg:hidden w-full sm:w-auto px-4 py-2 bg-gray-900 rounded-md text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="newest">Newest to Oldest</option>
                  <option value="oldest">Oldest to Newest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-900/50 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setMinPrice("");
                    setMaxPrice("");
                    setOnlyDiscounted(false);
                    setActiveCategory("All");
                  }}
                  className="mt-4 text-primary hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Pagination Controls */
              totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50 hover:bg-primary transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-md font-bold transition-colors ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50 hover:bg-primary transition-colors"
                  >
                    Next
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
