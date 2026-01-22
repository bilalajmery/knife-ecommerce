"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    category: "Ordering & Payments",
    questions: [
      {
        q: "How do I place an order?",
        a: "Simply browse our website, select the knife or product you want, choose any available options (such as size or finish), and click Add to Cart. Then proceed to checkout and complete your payment.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit and debit cards, PayPal, and other secure payment methods available at checkout.",
      },
      {
        q: "Can I cancel or change my order?",
        a: "Orders are processed quickly, usually within 1–3 business days. If you need to cancel or change your order, contact us as soon as possible at support@knifemasters.com. We cannot guarantee changes once an order has been processed.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "Do you ship nationwide?",
        a: "Yes! We ship to all U.S. addresses where knives are legally allowed. Customers are responsible for ensuring compliance with local laws.",
      },
      {
        q: "How long does shipping take?",
        a: "Orders are processed within 1–3 business days. Shipping times depend on your location and the carrier selected at checkout. Transit times are provided by the carrier and are not guaranteed.",
      },
      {
        q: "How much does shipping cost?",
        a: "Shipping rates are calculated at checkout based on package weight, destination, and selected shipping method. Any applicable taxes, duties, or customs fees are the responsibility of the customer.",
      },
    ],
  },
  {
    category: "Returns & Warranty",
    questions: [
      {
        q: "Do you offer returns or exchanges?",
        a: "Yes! You may return a product within 7 days of delivery if you are not fully satisfied. Customers are responsible for return shipping unless the item was damaged, defective, missing parts, or incorrectly shipped by KnifeMasters.",
      },
      {
        q: "What if my knife arrives damaged or defective?",
        a: "Please contact us within 48 hours of delivery with photo or video evidence. We will provide a replacement, exchange, or refund at no additional cost.",
      },
      {
        q: "Do you offer a warranty?",
        a: "Yes! All KnifeMasters products include a limited 30-day warranty covering manufacturing defects in materials or workmanship present at delivery. The warranty does not cover normal wear, misuse, or damage after delivery.",
      },
    ],
  },
  {
    category: "Product Care & Legal",
    questions: [
      {
        q: "How do I care for my knife?",
        a: "Keep your knife clean and dry, store it safely away from children, avoid dropping or misuse, and sharpen only with proper tools. Proper care helps extend the life of your knife and keeps your warranty valid.",
      },
      {
        q: "Are knives shipped legally?",
        a: "Yes. KnifeMasters ships all products in compliance with U.S. federal law. Customers are responsible for knowing and following their local state and city knife laws.",
      },
    ],
  },
  {
    category: "Privacy & Support",
    questions: [
      {
        q: "Is my personal information safe?",
        a: "Yes. We take privacy seriously. Personal and payment information is used only to process orders and provide support. Payments are handled securely through trusted third-party providers.",
      },
      {
        q: "Can I contact you with questions?",
        a: "Absolutely! You can email us anytime at support@knifemasters.com, and our team will respond as quickly as possible.",
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
                          <div className="p-6 pt-3 text-gray-400 leading-relaxed border-t border-gray-800/50">
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
