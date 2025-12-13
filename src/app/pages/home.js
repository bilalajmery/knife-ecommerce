import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import HeroSlider from "@/app/components/HeroSlider";
import ProductCard from "@/app/components/ProductCard";
import Image from "next/image";
import Link from "next/link";

// Mock Data
const bestSellers = [
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
  {
    id: 13,
    name: "Forest Ranger",
    price: 115,
    category: "Hunting",
    image: "/hero-kitchen.png",
    hoverImage: "/hero-tactical.png",
    badge: "",
  },
];

const newArrivals = [
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
  {
    id: 10,
    name: "Cleaver Beast",
    price: 110,
    category: "Kitchen",
    image: "/hero-tactical.png",
    hoverImage: "/hero-knife.png",
    badge: "New Arrival",
  },
  {
    id: 14,
    name: "Urban Carry",
    price: 75,
    category: "Everyday",
    image: "/hero-knife.png",
    hoverImage: "/hero-kitchen.png",
    badge: "New Arrival",
  },
  {
    id: 15,
    name: "Marine Corps",
    price: 155,
    category: "Tactical",
    image: "/hero-tactical.png",
    hoverImage: "/hero-knife.png",
    badge: "New Arrival",
  },
  {
    id: 16,
    name: "Sushi Pro",
    price: 220,
    category: "Kitchen",
    image: "/hero-kitchen.png",
    hoverImage: "/hero-tactical.png",
    badge: "New Arrival",
  },
];

export default function HomePage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      <HeroSlider />

      {/* Collections Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="text-left">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Choose Your <span className="text-primary">Weapon</span>
            </h2>
            <p className="text-gray-400 max-w-2xl">
              Select from our premium categories designed for specific needs.
            </p>
          </div>
          <Link
            href="/collections"
            className="hidden md:block text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors mb-2"
          >
            See All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: "Hunting Series",
              description:
                "Built for the wild. Rugged, durable, and razor-sharp.",
              image: "/hero-knife.png",
              link: "/collections/hunting",
              count: 24,
            },
            {
              id: 2,
              title: "Kitchen Master",
              description:
                "Elevate your culinary skills with professional-grade blades.",
              image: "/hero-kitchen.png",
              link: "/collections/kitchen",
              count: 18,
            },
            {
              id: 3,
              title: "Tactical Ops",
              description:
                "Precision engineered for mission-critical performance.",
              image: "/hero-tactical.png",
              link: "/collections/tactical",
              count: 32,
            },
          ].map((collection) => (
            <Link
              key={collection.id}
              href={collection.link}
              className="group relative h-[500px] overflow-hidden rounded-lg border border-gray-800 hover:border-primary transition-all duration-500"
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="mb-2">
                  <span className="text-primary font-bold uppercase tracking-widest text-xs">
                    {collection.count} Products
                  </span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-3 text-white group-hover:text-primary transition-colors">
                  {collection.title}
                </h3>
                <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                  {collection.description}
                </p>
                <span className="inline-flex items-center text-white font-bold uppercase tracking-widest text-sm group-hover:text-primary transition-colors">
                  Explore Series <span className="ml-2">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/collections"
            className="text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
          >
            See All &rarr;
          </Link>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="py-20 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              Best <span className="text-primary">Sellers</span>
            </h2>
            <Link
              href="/shop/best-sellers"
              className="hidden md:block text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/shop/best-sellers"
              className="text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="relative py-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-knife.png"
            alt="Promo"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl">
            <span className="text-primary font-bold uppercase tracking-widest mb-2 block">
              Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              The Damascus <br /> Collection
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Hand-forged with 67 layers of premium steel. Unmatched sharpness
              and durability.
            </p>
            <Link
              href="/shop/damascus"
              className="inline-block bg-white text-black hover:bg-primary hover:text-white px-10 py-4 font-bold uppercase tracking-widest transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="py-20 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              New <span className="text-primary">Arrivals</span>
            </h2>
            <Link
              href="/shop/new-arrivals"
              className="hidden md:block text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/shop/new-arrivals"
              className="text-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-24 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Lifetime Warranty",
                desc: "Guaranteed for life.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              },
              {
                title: "Free Shipping",
                desc: "On all orders over $150.",
                icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
              },
              {
                title: "Secure Payment",
                desc: "100% secure checkout.",
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <svg
                    className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d={item.icon}
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
