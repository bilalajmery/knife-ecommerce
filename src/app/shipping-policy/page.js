"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  TruckIcon,
  GlobeAmericasIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function ShippingPolicy() {
  return (
    <React.Fragment>
      <Navbar />
      <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
        {/* Header */}
        <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-tactical.png"
              alt="Shipping Policy Header"
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
              <span className="text-white font-bold">Shipping Policy</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Global <span className="text-primary">Shipping</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Fast, secure, and reliable delivery for your premium blades. We
              ensure your order reaches you in perfect condition, anywhere in
              the world.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              {
                icon: TruckIcon,
                title: "Free Shipping",
                desc: "On orders over $99",
              },
              {
                icon: ClockIcon,
                title: "Fast Dispatch",
                desc: "Within 24 hours",
              },
              {
                icon: GlobeAmericasIcon,
                title: "Global Delivery",
                desc: "We ship worldwide",
              },
              {
                icon: CurrencyDollarIcon,
                title: "Insured",
                desc: "Full value coverage",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-900/30 border border-gray-800 p-6 rounded-2xl hover:bg-gray-900/50 transition-all duration-300"
              >
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Detailed Sections */}
          <div className="space-y-16">
            {/* Shipping Rates Table */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8 relative z-10">
                Shipping Rates
              </h2>

              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-sm">
                        Order Value
                      </th>
                      <th className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-sm">
                        Standard (3-5 Days)
                      </th>
                      <th className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-sm">
                        Express (1-2 Days)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-6 px-6 font-medium">Under $50</td>
                      <td className="py-6 px-6">$7.99</td>
                      <td className="py-6 px-6">$19.99</td>
                    </tr>
                    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-6 px-6 font-medium">$50 - $99</td>
                      <td className="py-6 px-6">$4.99</td>
                      <td className="py-6 px-6">$14.99</td>
                    </tr>
                    <tr className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-6 px-6 font-medium text-white">$99+</td>
                      <td className="py-6 px-6 text-primary font-bold">FREE</td>
                      <td className="py-6 px-6">$9.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Info Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-4 flex items-center">
                  <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
                  Processing Time
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  All orders are processed within 1-2 business days. Orders are
                  not shipped or delivered on weekends or holidays. If we are
                  experiencing a high volume of orders, shipments may be delayed
                  by a few days.
                </p>
              </div>

              <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-4 flex items-center">
                  <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
                  Customs & Duties
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  KnifeMaster is not responsible for any customs and taxes
                  applied to your order. All fees imposed during or after
                  shipping are the responsibility of the customer (tariffs,
                  taxes, etc.).
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="text-gray-500 mb-6">
              Still have questions about shipping?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
