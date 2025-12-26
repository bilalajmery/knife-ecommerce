"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";

const ITEMS_PER_PAGE = 9;

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to strip HTML tags for clean filter labels
  const stripHtml = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Products
        const prodRes = await fetch("/api/products?limit=100");
        const prodData = await prodRes.json();

        // Fetch Categories
        const catRes = await fetch("/api/admin/categories");
        const catData = await catRes.json();

        if (prodData.success) {
          const allProds = prodData.products;
          setProducts(allProds);
        }

        if (catData.categories) {
          const activeCats = catData.categories.filter(c => c.status === "active");
          setCategories(["All", ...activeCats.map(c => c.name)]);
        }
      } catch (err) {
        console.error("Failed to fetch shop data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (activeCategory !== "All") {
      result = result.filter((product) => product.category?.name === activeCategory || product.category === activeCategory);
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Price Filter
    if (minPrice || maxPrice) {
      result = result.filter((product) => {
        const effectivePrice = product.discount > 0
          ? product.price * (1 - product.discount / 100)
          : product.price;

        const min = minPrice ? Number(minPrice) : 0;
        const max = maxPrice ? Number(maxPrice) : Infinity;

        return effectivePrice >= min && effectivePrice <= max;
      });
    }

    // Discount Filter
    if (onlyDiscounted) {
      result = result.filter(
        (product) =>
          product.discount > 0 || (product.originalPrice && product.originalPrice > product.price)
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case "price-high-low":
        result.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt) || a._id.localeCompare(b._id));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b._id.localeCompare(a._id));
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, minPrice, maxPrice, onlyDiscounted, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
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
            className={`lg:w-1/4 space-y-8 ${showFilters ? "block" : "hidden lg:block"}`}
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
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary inline-block"></span>
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block w-full text-left text-sm transition-all duration-300 px-2 py-1 rounded break-words ${activeCategory === cat
                      ? "text-primary font-bold bg-primary/10 pl-3"
                      : "text-gray-400 hover:text-white hover:bg-white/5 pl-2"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>





            {/* Price Range */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary inline-block"></span>
                Price Range
              </h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-xs text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md pl-6 pr-2 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-xs text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md pl-6 pr-2 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Discount Checkbox */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer group p-2 bg-gray-900/50 rounded-md border border-gray-800 hover:border-primary/50 transition-all">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-primary rounded border-gray-800 bg-gray-900 focus:ring-primary focus:ring-offset-black"
                />
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">
                  Clearance Sale
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
                <ProductCard key={product._id} product={product} />
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
                        className={`w-10 h-10 rounded-md font-bold transition-colors ${currentPage === page
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
