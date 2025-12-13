"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'card'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle order submission logic here
    console.log("Order Placed:", { paymentMethod, formData });
    alert("Order Placed Successfully! (Mock)");
  };

  // Mock Cart Data for Summary
  const cartTotal = 318;
  const shipping = 0;
  const total = cartTotal + shipping;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-knife.png"
            alt="Checkout Header"
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
            <Link href="/cart" className="hover:text-primary transition-colors">
              Cart
            </Link>
            <span className="mx-3 text-gray-600">/</span>
            <span className="text-white font-bold">Checkout</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Secure <span className="text-primary">Checkout</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Complete your order and prepare for the ultimate edge.
          </p>
        </div>
      </div>

      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-12"
        >
          {/* Left Column: Billing & Payment */}
          <div className="lg:w-2/3 space-y-12">
            {/* Billing Details */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">
                Billing Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">
                Payment Method
              </h2>
              <div className="space-y-4">
                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/10"
                      : "border-gray-800 bg-gray-900/50 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-5 h-5 text-primary focus:ring-primary bg-gray-900 border-gray-700"
                  />
                  <div className="ml-4">
                    <span className="block font-bold uppercase tracking-wide">
                      Cash on Delivery
                    </span>
                    <span className="text-sm text-gray-400">
                      Pay with cash upon delivery.
                    </span>
                  </div>
                </label>

                {/* Credit Card Option */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10"
                      : "border-gray-800 bg-gray-900/50 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-5 h-5 text-primary focus:ring-primary bg-gray-900 border-gray-700"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="block font-bold uppercase tracking-wide">
                        Credit / Debit Card
                      </span>
                      <div className="flex gap-2">
                        <span className="text-xs font-bold bg-white text-black px-1 rounded">
                          VISA
                        </span>
                        <span className="text-xs font-bold bg-white text-black px-1 rounded">
                          MC
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      Secure online payment.
                    </span>
                  </div>
                </label>

                {/* Credit Card Fields (Conditional) */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    paymentMethod === "card"
                      ? "max-h-96 opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cvc"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg sticky top-32">
              <h2 className="text-xl font-black uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">
                Your Order
              </h2>

              {/* Mock Items List */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src="/hero-knife.png"
                      alt="Product"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">
                      Damascus Hunter
                    </h4>
                    <p className="text-xs text-gray-400">Qty: 1</p>
                  </div>
                  <span className="text-sm font-bold text-primary">$129</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src="/hero-kitchen.png"
                      alt="Product"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">
                      Chef's Choice
                    </h4>
                    <p className="text-xs text-gray-400">Qty: 2</p>
                  </div>
                  <span className="text-sm font-bold text-primary">$189</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 border-t border-gray-800 pt-4">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-white font-bold">
                    {shipping === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      `$${shipping}`
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-3xl font-black text-primary leading-none">
                    ${total}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold uppercase tracking-widest py-4 rounded-md hover:bg-red-700 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex justify-center items-center gap-2 group"
              >
                <span>Place Order</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
