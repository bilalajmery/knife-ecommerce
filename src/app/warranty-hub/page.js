"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

const warrantyPolicySections = [
  {
    title: "Warranty Policy Overview",
    description: [
      "Effective Date: 01/01/2024",
      "KnifeMasters stands behind the quality of its products. This Warranty Policy applies exclusively to manufacturing defects and outlines what is and is not covered.",
    ],
  },
  {
    title: "Limited Warranty Coverage",
    content: [
      "KnifeMasters warrants that all knives and products sold are free from manufacturing defects in materials or workmanship that exist at the time of delivery.",
      "Applies only to the original purchaser.",
      "Valid for thirty (30) days from the date of delivery.",
      "Applies only when the product is used under normal, intended use.",
    ],
  },
  {
    title: "What Is Covered",
    content: [
      "Defects in materials or workmanship present at the time of delivery.",
      "Structural defects that existed upon delivery.",
      "Defects that render the product unsafe or unusable under normal, intended use.",
    ],
  },
  {
    title: "What This Warranty Does Not Cover",
    content: [
      "Shipping damage, lost items, missing items, or incorrect items.",
      "Normal wear and tear.",
      "Damage caused by misuse, abuse, negligence, or improper handling.",
      "Damage from sharpening, modification, customization, or repair attempts.",
      "Corrosion, rust, discoloration, or patina due to improper care or environmental exposure.",
      "Accidental damage, drops, or impact damage occurring after delivery.",
      "Cosmetic variations due to natural materials.",
      "Damage caused after delivery that is not a manufacturing defect.",
      "Use of the product for illegal or unintended purposes.",
      "Shipping-related issues governed by the Replacement Order Policy and Shipping Policy.",
    ],
  },
  {
    title: "Warranty Claim Requirements",
    content: [
      "Contact KnifeMasters within thirty (30) days of delivery.",
      "Provide proof of purchase (order number).",
      "Provide clear photo or video evidence of the alleged defect.",
      "Provide photos of original packaging if requested.",
      "Failure to meet requirements may result in denial of the claim.",
    ],
  },
  {
    title: "Warranty Resolution",
    content: [
      "Repair the product.",
      "Replace the product.",
      "Issue a refund or store credit.",
      "Shipping responsibility is determined based on the approved defect.",
    ],
  },
  {
    title: "Exclusions & Limitations",
    content: [
      "All warranty claims are evaluated at the sole discretion of KnifeMasters.",
      "Replacement products may vary in appearance due to natural material variation.",
      "This warranty is non-transferable.",
    ],
  },
  {
    title: "Disclaimer of Other Warranties",
    description:
      "To the maximum extent permitted by law, this warranty is provided in lieu of all other warranties, express or implied, including implied warranties of merchantability and fitness for a particular purpose. Some state laws may not allow certain limitations.",
  },
  {
    title: "Limitation of Liability",
    description:
      "To the maximum extent permitted by law, KnifeMasters shall not be liable for any incidental, indirect, or consequential damages, including personal injury or property damage, arising from the use or misuse of any product.",
  },
  {
    title: "Governing Law",
    description:
      "This Warranty Policy shall be governed and interpreted in accordance with the laws of the State of New York.",
  },
];


export default function WarrantyHub() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <React.Fragment>
      <Navbar />
      <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
        {/* Header */}
        <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-tactical.png"
              alt="Warranty Hub Header"
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
              <span className="text-white font-bold">Warranty Hub</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Lifetime <span className="text-primary">Warranty</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              We build tools to last a lifetime. If your KnifeMasters product
              ever fails due to a defect in material or workmanship, we'll fix
              or replace it.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Warranty Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: CheckBadgeIcon,
                title: "Lifetime Coverage",
                desc: "Protected against defects forever",
              },
              {
                icon: WrenchScrewdriverIcon,
                title: "Expert Service",
                desc: "Repaired by master craftsmen",
              },
              {
                icon: ShieldExclamationIcon,
                title: "No Hassle",
                desc: "Simple and fast claim process",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-8 rounded-2xl hover:border-primary transition-all duration-300 group"
              >
                <div className="bg-black/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Warranty Policy Details */}
          <div className="my-20 ">
            <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8 space-y-10">
            {warrantyPolicySections.map((section, idx) => (
              <div
                key={idx}
                className=""
              >
                <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-4">
                  {idx + 1}. {section.title}
                </h3>

                {/* Paragraphs */}
                {Array.isArray(section.description) ? (
                  section.description.map((text, i) => (
                    <p key={i} className="text-gray-400 leading-relaxed mb-3">
                      {text}
                    </p>
                  ))
                ) : section.description ? (
                  <p className="text-gray-400 leading-relaxed mb-3">
                    {section.description}
                  </p>
                ) : null}

                {/* Bullet Points */}
                {section.content && (
                  <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed">
                    {section.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            </div>
          </div>


          {/* Coverage Details */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8 md:p-10">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-4"></span>
                What's Covered
              </h2>
              <ul className="space-y-6">
                {[
                  "Defects in materials or workmanship",
                  "Broken tips from normal use",
                  "Handle separation or cracking",
                  "Sheath defects upon arrival",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-4 mt-0.5">
                      <span className="text-green-500 text-sm font-bold">
                        ✓
                      </span>
                    </span>
                    <span className="text-gray-300 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8 md:p-10">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8 flex items-center">
                <span className="w-2 h-8 bg-red-500 rounded-full mr-4"></span>
                What's Not Covered
              </h2>
              <ul className="space-y-6">
                {[
                  "Normal wear and tear (scratches, dulling)",
                  "Damage from misuse or abuse (prying, throwing)",
                  "Rust due to lack of maintenance",
                  "Disassembly or modification",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-4 mt-0.5">
                      <span className="text-red-500 text-sm font-bold">✕</span>
                    </span>
                    <span className="text-gray-300 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          

          {/* Claim Process */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6 relative z-10">
              Need to file a claim?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 relative z-10">
              We've made the process as simple as possible. Just fill out our
              warranty form, ship your item to us, and we'll take care of the
              rest.
            </p>

            <button className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-primary to-red-700 text-white font-bold uppercase tracking-widest rounded-lg hover:shadow-2xl hover:shadow-primary/40 transition-all transform hover:scale-105 relative z-10 text-lg">
              Start Warranty Claim
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
