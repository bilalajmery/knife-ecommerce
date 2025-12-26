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

      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Redesigned */}
          <aside
            className={`lg:w-1/4 space-y-6 ${showFilters ? "fixed inset-0 z-50 bg-black p-6 overflow-y-auto" : "hidden lg:block"}`}
          >
            {showFilters && (
              <div className="flex justify-between items-center mb-8 lg:hidden">
                <h2 className="text-xl font-bold uppercase tracking-widest">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 bg-gray-900 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}

            {/* Search Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-primary"></span>
                Keyword
              </h3>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Masterpiece name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-primary"></span>
                Collection
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`group w-full text-left text-sm py-2.5 px-3 rounded-lg transition-all flex items-center justify-between ${activeCategory === cat
                      ? "bg-primary text-white font-bold"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span>{cat}</span>
                    <span className={`w-1 h-1 rounded-full transition-all ${activeCategory === cat ? "bg-white scale-150" : "bg-gray-700 group-hover:bg-primary"}`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-primary"></span>
                Budget
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-1.5 block">From</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-7 pr-2 py-2.5 text-xs focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-1.5 block">To</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-7 pr-2 py-2.5 text-xs focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group p-3 bg-black/30 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      className="peer appearance-none h-4 w-4 border border-white/20 rounded-md bg-transparent checked:bg-primary checked:border-primary transition-all"
                    />
                    <svg className="absolute left-0 top-0 w-4 h-4 text-white p-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 group-hover:text-white transition-colors">
                    Exclusive Deals
                  </span>
                </label>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setMinPrice("");
                    setMaxPrice("");
                    setOnlyDiscounted(false);
                    setActiveCategory("All");
                  }}
                  className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors py-2"
                >
                  Reset Settings
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid Area Container */}
          <div className="lg:w-3/4">
            {/* Professional Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <button
                  className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  onClick={() => setShowFilters(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Filter
                </button>
                <div className="hidden sm:block">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                    <span className="text-white font-black">{filteredProducts.length}</span> Masterpieces found
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto sm:ml-auto">
                <div className="relative w-full sm:w-72 group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-focus-within:text-primary transition-colors">Sort:</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-4 py-3 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none text-white"
                  >
                    <option value="newest" className="bg-gray-900">New Arrivals</option>
                    <option value="oldest" className="bg-gray-900">Vintage First</option>
                    <option value="price-low-high" className="bg-gray-900">Value (Low to High)</option>
                    <option value="price-high-low" className="bg-gray-900">Premium (High to Low)</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid Area */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((skel) => (
                  <div key={skel} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="mb-6 inline-flex p-6 bg-primary/10 rounded-full">
                  <svg className="w-12 h-12 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">No Blades Found</h4>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-10 leading-relaxed font-light">
                  No items match your current selection. Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setMinPrice("");
                    setMaxPrice("");
                    setOnlyDiscounted(false);
                    setActiveCategory("All");
                  }}
                  className="bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] px-10 py-4 rounded-full shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)] active:scale-95 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls - Redesigned */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-24 space-x-3">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-20 hover:bg-primary/20 hover:border-primary/50 transition-all group"
                    >
                      <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1.5 px-3 space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-black transition-all ${currentPage === page
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "text-gray-500 hover:text-white"
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-20 hover:bg-primary/20 hover:border-primary/50 transition-all group"
                    >
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
