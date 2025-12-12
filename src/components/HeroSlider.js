"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/hero-knife.png",
    title: "Forged in Fire",
    subtitle:
      "Experience the pinnacle of craftsmanship with our premium collection.",
    cta: "Shop Collection",
    link: "/shop",
  },
  {
    id: 2,
    image: "/hero-kitchen.png",
    title: "Culinary Precision",
    subtitle: "Elevate your cooking with blades designed for the masters.",
    cta: "Shop Kitchen",
    link: "/shop/kitchen",
  },
  {
    id: 3,
    image: "/hero-tactical.png",
    title: "Wilderness Ready",
    subtitle: "Rugged durability for the toughest environments.",
    cta: "Shop Tactical",
    link: "/shop/tactical",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Image with overlay */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 uppercase text-white drop-shadow-2xl transform transition-transform duration-700 translate-y-0">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-10 font-light tracking-wide">
              {slide.subtitle}
            </p>
            <Link
              href={slide.link}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase tracking-widest overflow-hidden transition-all bg-primary hover:bg-red-700"
            >
              <span className="relative z-10">{slide.cta}</span>
            </Link>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
