"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const collections = [
  {
    id: 1,
    title: "Hunting Series",
    description: "Built for the wild. Rugged, durable, and razor-sharp.",
    image: "/hero-knife.png",
    link: "/collections/hunting",
    count: 24,
  },
  {
    id: 2,
    title: "Kitchen Master",
    description: "Elevate your culinary skills with professional-grade blades.",
    image: "/hero-kitchen.png",
    link: "/collections/kitchen",
    count: 18,
  },
  {
    id: 3,
    title: "Tactical Ops",
    description: "Precision engineered for mission-critical performance.",
    image: "/hero-tactical.png",
    link: "/collections/tactical",
    count: 32,
  },
  {
    id: 4,
    title: "Outdoor Survival",
    description: "Your trusty companion for every adventure.",
    image: "/hero-knife.png",
    link: "/collections/outdoor",
    count: 15,
  },
  {
    id: 5,
    title: "Everyday Carry",
    description: "Compact, reliable, and ready for anything.",
    image: "/hero-tactical.png",
    link: "/collections/everyday",
    count: 40,
  },
  {
    id: 6,
    title: "Limited Edition",
    description: "Exclusive designs for the discerning collector.",
    image: "/hero-kitchen.png",
    link: "/collections/limited",
    count: 8,
  },
];

export default function CollectionsPage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-knife.png"
            alt="Collections Header"
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
            <span className="text-white font-bold">Collections</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Our <span className="text-primary">Collections</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Discover our curated series of premium knives, each designed with a
            specific purpose in mind.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.link}
              className="group relative h-[400px] overflow-hidden rounded-lg border border-gray-800 hover:border-primary transition-all duration-500"
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
                <p className="mb-6 text-white group-hover:text-primary transition-colors line-clamp-2">
                  {collection.description}
                </p>
                <span className="inline-flex items-center text-white font-bold uppercase tracking-widest text-sm group-hover:text-primary transition-colors">
                  Explore Series <span className="ml-2">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
