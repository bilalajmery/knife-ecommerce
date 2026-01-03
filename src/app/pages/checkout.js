"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cartItems = cart.items || [];
  const appliedDiscount = cart.discount || 0;
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const freeShippingThreshold = 150;
  const shipping = subtotal > freeShippingThreshold ? 0 : 15;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const total = subtotal + shipping - discountAmount;

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("Please accept the Terms and Conditions to proceed.");
      return;
    }
    if (!stripe || !elements) return;

    setSubmitting(true);

    try {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        setSubmitting(false);
        return;
      }

      // 1. Create Payment Intent on the server
      const intentRes = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          metadata: {
            email: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
          },
        }),
      });

      const { clientSecret, message: intentError } = await intentRes.json();

      if (intentError) {
        toast.error(intentError);
        setSubmitting(false);
        return;
      }

      // 2. Confirm Payment on the client
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.zip,
              },
            },
          },
        }
      );

      if (stripeError) {
        toast.error(stripeError.message);
        setSubmitting(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Create Order in the database
        const orderData = {
          userId: cart.user,
          items: cartItems.map((item) => ({
            product: item.product._id || item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress: { ...formData },
          paymentMethod: "stripe",
          paymentId: paymentIntent.id,
          total,
          discount: appliedDiscount,
          appliedPromo: cart.appliedPromo,
        };

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("Payment successful! Order placed.");
          clearCart(); // Clear local cart state and localStorage
          setTimeout(() => {
            router.push(`/thank-you?orderId=${data.orderId}`);
          }, 1500);
        } else {
          toast.error(data.message || "Failed to save order");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="bg-black min-h-screen text-white font-sans flex items-center justify-center">
        <Navbar />
        <div className="animate-pulse">Loading Checkout...</div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
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
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="block font-bold uppercase tracking-wide">
                    Credit / Debit Card
                  </span>
                  {/* <div className="flex gap-2">
                    <span className="text-xs font-bold bg-white text-black px-1 rounded">
                      VISA
                    </span>
                    <span className="text-xs font-bold bg-white text-black px-1 rounded">
                      MC
                    </span>
                  </div> */}
                </div>

                <div className="p-4 bg-black border border-gray-800 rounded-md">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#fff",
                          "::placeholder": {
                            color: "#4b5563",
                          },
                        },
                        invalid: {
                          color: "#ef4444",
                        },
                      },
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Your payment is processed securely via Stripe.
                </p>
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

            {/* Cart Items List */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div
                  key={item.product._id || item.product}
                  className="flex gap-4 items-center"
                >
                  <div className="relative w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 border-t border-gray-800 pt-4">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span className="text-white font-bold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Shipping</span>
                <span className="text-white font-bold">
                  {shipping === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {cart.appliedPromo && cart.discount > 0 && (
                <div className="flex justify-between text-green-500 text-sm">
                  <span>
                    Discount (
                    {typeof cart.appliedPromo === "object"
                      ? cart.appliedPromo.code
                      : cart.appliedPromo}
                    )
                  </span>
                  <span className="font-bold">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-800 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-3xl font-black text-primary leading-none">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !stripe}
              className="w-full bg-primary text-white font-bold uppercase tracking-widest py-4 rounded-md hover:bg-red-700 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{submitting ? "Processing..." : "Pay Now"}</span>
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

            <div className="flex items-start gap-2 mt-4">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary focus:ring-offset-gray-900"
              />
              <label htmlFor="terms" className="text-xs text-gray-400">
                I agree to the <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
              </label>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
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

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>

      <Footer />
    </div>
  );
}
