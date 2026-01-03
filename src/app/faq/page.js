"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping typically takes 3-5 business days within the continental US. International shipping can take 7-14 business days depending on the destination and customs processing.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. Please note that customers are responsible for any customs duties or taxes imposed by their country.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships, you'll receive a confirmation email with a tracking number that you can use on our Track Order page.",
      },
    ],
  },
  {
    category: "Returns & Warranty",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day hassle-free return policy for all unused items in their original packaging. Simply contact our support team to initiate a return.",
      },
      {
        q: "Do your knives come with a warranty?",
        a: "Yes, all KnifeMasters knives come with a Lifetime Warranty against defects in material and workmanship. We stand behind the quality of our products.",
      },
    ],
  },
  {
    category: "Product Care",
    questions: [
      {
        q: "How should I sharpen my knife?",
        a: "We recommend using a whetstone or a high-quality sharpening system. Avoid pull-through sharpeners as they can damage the blade edge over time. We also offer professional sharpening services.",
      },
      {
        q: "Are your knives dishwasher safe?",
        a: "No. We strongly recommend hand washing your knives with mild soap and warm water, then drying them immediately to prevent rust and handle damage.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState("0-0");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
              alt="FAQ Header"
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
              <span className="text-white font-bold">FAQ</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Find answers to common questions about our products, shipping, and
              services. Can't find what you're looking for? Contact us.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-16">
            {faqs.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-8 flex items-center">
                  <span className="w-1.5 h-8 bg-primary rounded-full mr-4"></span>
                  {section.category}
                </h2>
                <div className="space-y-4">
                  {section.questions.map((item, itemIdx) => {
                    const index = `${sectionIdx}-${itemIdx}`;
                    const isOpen = openIndex === index;

                    return (
                      <div
                        key={itemIdx}
                        className={`bg-gray-900/30 border ${isOpen ? "border-primary/50" : "border-gray-800"
                          } rounded-xl overflow-hidden transition-all duration-300`}
                      >
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-900/50 transition-colors"
                        >
                          <span
                            className={`font-bold text-lg ${isOpen ? "text-white" : "text-gray-400"
                              }`}
                          >
                            {item.q}
                          </span>
                          <span
                            className={`ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen
                              ? "rotate-180 text-primary"
                              : "text-gray-500"
                              }`}
                          >
                            {isOpen ? (
                              <MinusIcon className="w-6 h-6" />
                            ) : (
                              <PlusIcon className="w-6 h-6" />
                            )}
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                            }`}
                        >
                          <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-gray-800/50 mt-2">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-20 text-center bg-gray-900/30 border border-gray-800 rounded-3xl p-12">
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              We're here to help. Our support team is available Monday through
              Friday, 9am to 5pm EST.
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
