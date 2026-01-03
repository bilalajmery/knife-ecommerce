"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/hero-knife.png",
    title: "Forged in Fire",
    subtitle:
      "Experience the pinnacle of craftsmanship with our premium collection.",
    cta: "Shop Collection",
    link: "/shop",
    accentColor: "from-red-600/20 to-transparent"
  },
  {
    id: 2,
    image: "/hero-kitchen.png",
    title: "Culinary Precision",
    subtitle: "Elevate your cooking with blades designed for the masters.",
    cta: "Shop Kitchen",
    link: "/shop/kitchen",
    accentColor: "from-blue-600/20 to-transparent"
  },
  {
    id: 3,
    image: "/hero-tactical.png",
    title: "Wilderness Ready",
    subtitle: "Rugged durability for the toughest environments.",
    cta: "Shop Tactical",
    link: "/shop/tactical",
    accentColor: "from-green-600/20 to-transparent"
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {/* Background Image with Parallax effect */}
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            {/* Dynamic Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].accentColor} opacity-40`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-1.5 border border-primary/30 rounded-full text-xs font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 backdrop-blur-sm">
                Next-Gen Blades
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 uppercase text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none"
            >
              {slides[currentSlide].title.split(" ").map((word, i) => (
                <span key={i} className={i === 1 && currentSlide === 0 ? "text-primary" : ""}>
                  {word}{" "}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-12 font-medium tracking-wide leading-relaxed drop-shadow-lg"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Link
                href={slides[currentSlide].link}
                className="group relative overflow-hidden inline-flex items-center justify-center px-10 py-5 bg-primary text-white text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black shadow-[0_15px_30px_rgba(225,29,72,0.3)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] active:scale-95"
              >
                <span className="relative z-10">{slides[currentSlide].cta}</span>
                <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative flex items-center py-4"
          >
            <div className={`h-[2px] transition-all duration-500 rounded-full ${index === currentSlide ? "w-16 bg-primary" : "w-8 bg-white/30 group-hover:bg-white/60"}`} />
            {index === currentSlide && (
              <motion.span
                layoutId="activeIndicator"
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary uppercase tracking-[0.2em]"
              >
                0{index + 1}
              </motion.span>
            )}
          </button>
        ))}
      </div>

      {/* Decorative Side Elements */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-8">
        {['Instagram', 'Twitter', 'Facebook'].map((social) => (
          <span
            key={social}
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-colors cursor-pointer"
          >
            {social}
          </span>
        ))}
      </div>
    </div>
  );
}
