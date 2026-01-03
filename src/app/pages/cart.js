"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, addToCart, loading, applyPromo, removePromo } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [randomProducts, setRandomProducts] = useState([]);

  // Derived state from cart context
  const appliedPromo = cart?.appliedPromo || "";
  const discount = cart?.discount || 0;

  console.log("CartPage Render. Cart:", JSON.stringify(cart));
  console.log("Derived State - Discount:", discount, "Applied:", appliedPromo);

  useEffect(() => {
    async function fetchRandomProducts() {
      try {
        const res = await fetch("/api/products?random=true&limit=3");
        const data = await res.json();
        if (data.success) {
          setRandomProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch random products:", error);
      }
    }
    fetchRandomProducts();
  }, []);

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  const handleRemovePromo = async () => {
    const result = await removePromo();
    if (result.success) {
      toast.success("Promo code removed");
    } else {
      toast.error("Failed to remove promo");
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    const result = await applyPromo(promoCode);

    if (result.success) {
      toast.success(result.message);
      setPromoCode("");
    } else {
      toast.error(result.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white font-sans flex items-center justify-center">
        <Navbar />
        <div className="animate-pulse">Loading Cart...</div>
        <Footer />
      </div>
    );
  }

  const cartItems = cart.items || [];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const freeShippingThreshold = 150;
  const shipping = subtotal > freeShippingThreshold ? 0 : 15;
  const discountAmount = (subtotal * discount) / 100;
  // Use context's total if available, otherwise calculate locally
  const total = cart.totalAmount || (subtotal + shipping - discountAmount);
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-tactical.png"
            alt="Cart Header"
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
            <span className="text-white font-bold">Cart</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Shopping <span className="text-primary">Cart</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Review your selected items and proceed to secure checkout.
          </p>
        </div>
      </div>

      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Cart Section */}
            <div className="lg:w-2/3">
              {/* Free Shipping Progress */}
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold uppercase tracking-wide text-gray-300">
                    {subtotal >= freeShippingThreshold
                      ? "You've unlocked Free Shipping!"
                      : `Add $${(freeShippingThreshold - subtotal).toFixed(2)
                      } more for Free Shipping`}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Cart Items Header (Desktop) */}
              <div className="hidden sm:grid grid-cols-12 gap-4 text-sm font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800 pb-4 mb-6">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const productId = item.product._id || item.product.id || item.product;
                  return (
                    <div
                      key={productId}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-gray-900/30 border border-gray-800 p-4 rounded-lg sm:bg-transparent sm:border-0 sm:p-0 sm:rounded-none sm:border-b sm:border-gray-800 sm:pb-6"
                    >
                      {/* Product Info */}
                      <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-800 rounded-md overflow-hidden border border-gray-700">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold uppercase tracking-wide text-white mb-1">
                            <Link
                              href={`/product/${item.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                          </h3>
                          {/* 
                         <p className="text-sm text-gray-400 mb-2">
                          {item.category}
                        </p> 
                        */}
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="text-xs text-red-500 hover:text-red-400 uppercase tracking-wider font-bold flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-1 sm:col-span-2 text-left sm:text-center">
                        <span className="sm:hidden text-gray-500 text-xs uppercase font-bold mr-2">
                          Price:
                        </span>
                        <span className="text-white font-bold">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center">
                        <div className="flex items-center border border-gray-700 rounded-md bg-gray-900">
                          <button
                            onClick={() =>
                              updateQuantity(productId, item.quantity - 1)
                            }
                            className="px-3 py-1 text-gray-400 hover:text-white transition-colors hover:bg-gray-800"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-white font-bold w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(productId, item.quantity + 1)
                            }
                            className="px-3 py-1 text-gray-400 hover:text-white transition-colors hover:bg-gray-800"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-1 sm:col-span-2 text-left sm:text-right">
                        <span className="sm:hidden text-gray-500 text-xs uppercase font-bold mr-2">
                          Total:
                        </span>
                        <span className="text-primary font-bold text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* You Might Also Like */}
              <div className="mt-16">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">
                  You Might Also Like
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {randomProducts.map((product) => (
                    <div
                      key={product._id}
                      className="group bg-gray-900/30 border border-gray-800 rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="relative h-40 mb-4 bg-gray-800 rounded overflow-hidden">
                        <Image
                          src={product.mainImage || "/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="font-bold text-white mb-1">
                        {product.name}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold">
                          ${product.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="text-xs uppercase font-bold text-gray-400 hover:text-white border-b border-gray-600 hover:border-white transition-all"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg sticky top-32">
                <h2 className="text-xl font-black uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white font-bold">
                      {shipping === 0 ? (
                        <span className="text-green-500">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (Estimated)</span>
                    <span className="text-white font-bold">$0.00</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount ({discount}%)</span>
                      <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-800 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-white">Total</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-primary block leading-none">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-8">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Promo Code
                  </label>
                  {appliedPromo ? (
                    <div className="bg-gray-800 border border-green-500/30 rounded p-3 flex justify-between items-center">
                      <div>
                        <span className="block text-green-500 font-bold uppercase tracking-wider text-sm">{appliedPromo}</span>
                        <span className="text-xs text-gray-400">Discount Applied</span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary text-white placeholder-gray-600"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <Link href="/checkout">
                  <button className="w-full bg-primary text-white font-bold uppercase tracking-widest py-4 rounded-md hover:bg-red-700 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 mb-4 flex justify-center items-center gap-2 group">
                    <span>Proceed to Checkout</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure Checkout Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-900/30 rounded-lg border border-gray-800 border-dashed">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
              Your Cart is Empty
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
              Looks like you haven't made your choice yet. The forge is waiting.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white hover:bg-red-700 px-10 py-4 font-bold uppercase tracking-widest rounded-md transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
