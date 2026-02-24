"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const termsSections = [
  {
    title: "Introduction",
    description: [
      "Welcome to KnifeMasters. These Terms of Service (“Terms”) govern your access to and use of our website and the purchase of products from KnifeMasters (“we,” “us,” or “our”).",
      "By accessing our website or placing an order, you agree to be bound by these Terms. If you do not agree, you may not use our website or services.",
    ],
  },
  {
    title: "Eligibility & Legal Compliance",
    content: [
      "You must be at least 18 years old to purchase products from KnifeMasters.",
      "By placing an order, you represent that knife ownership and shipment are legal in your jurisdiction.",
      "KnifeMasters is not responsible for violations of local, state, or federal laws related to knife possession or use.",
    ],
  },
  {
    title: "Product Information & Availability",
    content: [
      "We make reasonable efforts to ensure product descriptions, pricing, and images are accurate.",
      "Colors, materials, and finishes may vary due to natural materials or display settings.",
      "KnifeMasters reserves the right to modify or discontinue products at any time without notice.",
    ],
  },
  {
    title: "Orders & Payments",
    content: [
      "All orders are subject to acceptance and availability.",
      "We reserve the right to refuse or cancel any order for any reason.",
      "Prices are listed in U.S. dollars.",
      "Payment must be received in full before shipment.",
    ],
  },
  {
    title: "Shipping & Risk of Loss",
    content: [
      "Shipping is governed by our Shipping Policy.",
      "Title and risk of loss pass to the customer upon delivery to the carrier.",
    ],
  },
  {
    title: "Returns, Refunds & Exchanges",
    content: [
      "Returns and exchanges are governed by our Returns & Exchange Policy.",
      "Customers are responsible for return shipping unless due to our error.",
    ],
  },
  {
    title: "Use of Products & Safety Disclaimer",
    content: [
      "Knives are inherently sharp and potentially dangerous tools.",
      "Products must be used responsibly and for their intended purpose.",
      "KnifeMasters is not responsible for misuse or improper handling.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All website content is the property of KnifeMasters.",
      "Content may not be used without written permission.",
    ],
  },
  {
    title: "Prohibited Use",
    content: [
      "Using the website for unlawful purposes.",
      "Attempting unauthorized access.",
      "Interfering with website functionality.",
      "Submitting false information.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "KnifeMasters shall not be liable for indirect or consequential damages.",
      "Damages exceeding the product purchase price.",
    ],
  },
  {
    title: "Indemnification",
    description:
      "You agree to indemnify and hold harmless KnifeMasters from claims arising from:",
    content: [
      "Your misuse of products.",
      "Violation of these Terms.",
      "Violation of applicable laws.",
    ],
  },
  {
    title: "Third-Party Services",
    description:
      "We may use third-party services such as payment processors or shipping carriers. KnifeMasters is not responsible for their actions or policies.",
  },
  {
    title: "Termination",
    description:
      "We reserve the right to terminate or restrict access for violations of these Terms.",
  },
  {
    title: "Governing Law",
    description:
      "These Terms are governed by the laws of the State of New York.",
  },
  {
    title: "Changes to These Terms",
    description:
      "KnifeMasters may update these Terms at any time. Changes take effect immediately upon posting.",
  },
];


export default function TermsOfService() {
    return (
        <React.Fragment>
            <Navbar />
            <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
                {/* Header */}
                <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src="/hero-tactical.png"
                            alt="Terms of Service Header"
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
                            <span className="text-white font-bold">Terms of Service</span>
                        </nav>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                            Terms of <span className="text-primary">Service</span>
                        </h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                            Last Updated: 01/01/2024
                            {/* {new Date().toLocaleDateString()} */}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 space-y-10">
  {termsSections.map((section, idx) => (
  <section key={idx} className="space-y-4">
    <h2 className="text-2xl font-bold text-white flex items-center">
      <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
      {idx + 1}. {section.title}
    </h2>

    {/* Description */}
    {Array.isArray(section.description) ? (
      section.description.map((text, i) => (
        <p key={i} className="text-gray-400 leading-relaxed">
          {text}
        </p>
      ))
    ) : section.description ? (
      <p className="text-gray-400 leading-relaxed">
        {section.description}
      </p>
    ) : null}

    {/* Bullet content */}
    {section.content && (
      <ul className="space-y-3 text-gray-400 leading-relaxed list-disc list-inside">
        {section.content.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )}
  </section>
))}
</div>

                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
