"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  MagnifyingGlassIcon,
  TruckIcon,
  MapPinIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [result, setResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingNumber) return;

    setIsTracking(true);
    // Simulate API call
    setTimeout(() => {
      setIsTracking(false);
      setResult({
        status: "In Transit",
        location: "Distribution Center, NY",
        estimatedDelivery: "Oct 24, 2025",
        progress: 65,
        timeline: [
          { status: "Order Placed", date: "Oct 20, 2025", completed: true },
          { status: "Processing", date: "Oct 21, 2025", completed: true },
          { status: "Shipped", date: "Oct 22, 2025", completed: true },
          {
            status: "In Transit",
            date: "Oct 23, 2025",
            completed: true,
            current: true,
          },
          { status: "Delivered", date: "Est. Oct 24, 2025", completed: false },
        ],
      });
    }, 1500);
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
        {/* Header */}
        <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-tactical.png"
              alt="Track Order Header"
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
              <span className="text-white font-bold">Track Order</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Track Your <span className="text-primary">Order</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-10">
              Enter your tracking number below to see the real-time status of
              your delivery.
            </p>

            {/* Search Form */}
            <form onSubmit={handleTrack} className="max-w-xl mx-auto relative">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-red-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex bg-black rounded-xl border border-gray-800 p-2">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter Tracking Number (e.g., BM-123456)"
                    className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-600 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isTracking}
                    className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isTracking ? (
                      <span className="animate-pulse">Tracking...</span>
                    ) : (
                      <>
                        Track <MagnifyingGlassIcon className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
              {/* Status Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-gray-800">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                    {result.status}
                  </h2>
                  <p className="text-gray-400 flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-primary" />
                    {result.location}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">
                    Estimated Delivery
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {result.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-16">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-red-500 transition-all duration-1000 ease-out"
                    style={{ width: `${result.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-8">
                {result.timeline.map((event, idx) => (
                  <div key={idx} className="flex relative">
                    {/* Line */}
                    {idx !== result.timeline.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-gray-800"></div>
                    )}

                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
                        event.completed
                          ? "bg-primary border-primary text-white"
                          : event.current
                          ? "bg-black border-primary text-primary animate-pulse"
                          : "bg-black border-gray-700 text-gray-700"
                      }`}
                    >
                      {event.completed ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <div
                          className={`w-3 h-3 rounded-full ${
                            event.current ? "bg-primary" : "bg-gray-700"
                          }`}
                        ></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="ml-6 pt-1">
                      <h4
                        className={`text-lg font-bold ${
                          event.completed || event.current
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {event.status}
                      </h4>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </React.Fragment>
  );
}
