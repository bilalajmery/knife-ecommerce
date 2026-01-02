"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  ArrowLeftIcon,
  HomeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function NotFound() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-[#111] p-8 rounded-2xl border border-gray-900 shadow-2xl">
          <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">404</h1>
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            The admin page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/admin/home"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 w-full"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-1 relative flex items-center justify-center min-h-[800px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-knife.png"
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-9xl font-black text-primary/20 select-none mb-4">
            404
          </h1>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-white">
            Lost in the <span className="text-primary">Wild?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            The page you are looking for has been moved, removed, or never
            existed. Return to our forge to find the perfect blade.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-10 py-4 bg-primary text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Return Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
