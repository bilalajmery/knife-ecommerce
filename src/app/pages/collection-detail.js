"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";

// Mock Data (Shared with Shop)
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

// Collection Metadata (Descriptions, Images)
const collectionInfo = {
  hunting: {
    title: "Hunting Series",
    description: "Built for the wild. Rugged, durable, and razor-sharp.",
    image: "/hero-knife.png",
  },
  kitchen: {
    title: "Kitchen Master",
    description: "Elevate your culinary skills with professional-grade blades.",
    image: "/hero-kitchen.png",
  },
  tactical: {
    title: "Tactical Ops",
    description: "Precision engineered for mission-critical performance.",
    image: "/hero-tactical.png",
  },
  outdoor: {
    title: "Outdoor Survival",
    description: "Your trusty companion for every adventure.",
    image: "/hero-knife.png",
  },
  everyday: {
    title: "Everyday Carry",
    description: "Compact, reliable, and ready for anything.",
    image: "/hero-tactical.png",
  },
  limited: {
    title: "Limited Edition",
    description: "Exclusive designs for the discerning collector.",
    image: "/hero-kitchen.png",
  },
};

export default function CollectionDetailPage({ params, initialData }) {
  const slug = params.slug;

  // Use passed data or fallback to empty state
  const info = initialData?.category || {
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: "Premium collection.",
    image: "/hero-knife.png",
  };

  const products = initialData?.products || [];


  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={info.image}
            alt={info.title}
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
            <Link
              href="/collections"
              className="hover:text-primary transition-colors"
            >
              Collections
            </Link>
            <span className="mx-3 text-gray-600">/</span>
            <span className="text-white font-bold">{info.title}</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            {info.title}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            {info.description}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-500 text-lg">
              No products found in this collection.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
