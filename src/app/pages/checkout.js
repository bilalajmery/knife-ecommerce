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
  const { cart, loading: cartLoading, clearCart, removeFromCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
  });

  // Location Data States
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  // Fetch Countries on Mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("/api/admin/countries");
        const data = await res.json();
        if (data.countries) setAvailableCountries(data.countries);
      } catch (err) {
        console.error("Failed to fetch countries", err);
      }
    }
    fetchCountries();
  }, []);

  // Fetch States when Country changes
  useEffect(() => {
    async function fetchStates() {
      if (!formData.country) {
        setAvailableStates([]);
        return;
      }
      try {
        const res = await fetch(`/api/admin/states?country=${formData.country}`);
        const data = await res.json();
        if (data.states) setAvailableStates(data.states);
      } catch (err) {
        console.error("Failed to fetch states", err);
      }
    }
    fetchStates();
  }, [formData.country]);

  // Fetch Cities when State changes
  useEffect(() => {
    async function fetchCities() {
      if (!formData.state) {
        setAvailableCities([]);
        return;
      }
      try {
        const res = await fetch(`/api/admin/cities?state=${formData.state}`);
        const data = await res.json();
        if (data.cities) setAvailableCities(data.cities);
      } catch (err) {
        console.error("Failed to fetch cities", err);
      }
    }
    fetchCities();
  }, [formData.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Reset dependent fields
      if (name === "country") {
        next.state = "";
        next.city = "";
      }
      if (name === "state") {
        next.city = "";
      }
      return next;
    });
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

  const selectedStateForTax = availableStates.find(s => s._id === formData.state);
  const taxPercentage = selectedStateForTax?.taxPercentage || 0;
  const taxAmount = ((subtotal - discountAmount) * taxPercentage) / 100;

  const total = subtotal + shipping - discountAmount + taxAmount;

  // Check for banned products in selected state
  const bannedProductsInSelectedState = cartItems.filter(item => {
    const product = item.product;
    if (product && product.bannedStates && formData.state) {
      return product.bannedStates.some(id => id.toString() === formData.state.toString());
    }
    return false;
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("Please accept the Terms and Conditions to proceed.");
      return;
    }
    if (bannedProductsInSelectedState.length > 0) {
      toast.error("Some products in your cart cannot be delivered to your selected state.");
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

      // Resolve Names/Codes for STRIPE (Database will store IDs)
      const selectedCountry = availableCountries.find(c => c._id === formData.country);
      const selectedState = availableStates.find(s => s._id === formData.state);
      const selectedCity = availableCities.find(c => c._id === formData.city);

      if (!selectedCountry || !selectedState || !selectedCity) {
        toast.error("Invalid address selection");
        setSubmitting(false);
        return;
      }

      // Address Object for Database (Uses IDs)
      const shippingAddressForDb = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city, // ID
        state: formData.state, // ID
        zip: formData.zip,
        country: formData.country, // ID
      };

      // Address Object for Stripe (Uses Names/Codes)
      const shippingAddressForStripe = {
        line1: formData.address,
        city: selectedCity.name,
        state: selectedState.name,
        postal_code: formData.zip,
        country: selectedCountry.code, // ISO Code
      };

      // 1. Create Payment Intent on the server
      const intentRes = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          metadata: {
            email: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
            country: shippingAddressForStripe.country,
            orderType: "knife-ecommerce"
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
              address: shippingAddressForStripe,
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
          shippingAddress: shippingAddressForDb,
          paymentMethod: "stripe",
          paymentId: paymentIntent.id,
          total,
          discount: appliedDiscount,
          tax: taxAmount,
          taxPercentage: taxPercentage,
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
        <div className="animate-pulse text-primary font-black uppercase tracking-widest text-xl">Loading Checkout...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800 shadow-2xl shadow-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
          Looks like you haven't added any legendary edges to your arsenal yet. Head back to our shop to explore our latest collections.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-primary text-white font-black uppercase tracking-widest px-10 py-4 rounded-md hover:bg-red-700 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Moved Banned Products Warning to Top */}
      {formData.state && bannedProductsInSelectedState.length > 0 && (
        <section className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-12 space-y-4">
          <div className="flex items-center gap-3 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-black uppercase tracking-wider">Delivery Restriction</h3>
          </div>
          <p className="text-sm text-gray-300">
            The following products in your cart <span className="text-red-500 font-bold uppercase">cannot be delivered</span> to <strong>{selectedStateForTax?.name}</strong> due to local regulations.
          </p>
          <div className="space-y-3">
            {bannedProductsInSelectedState.map((item) => (
              <div key={item.product._id || item.product} className="flex items-center justify-between bg-black/40 p-3 rounded-md border border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded overflow-hidden border border-gray-800">
                    <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide">{item.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product._id || item.product)}
                  className="text-xs font-black text-red-500 hover:text-red-400 uppercase tracking-widest border-b border-red-500/50 pb-0.5 transition-colors"
                >
                  Remove Item
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 italic">
            You must remove these items or change your delivery state to proceed with your order.
          </p>
        </section>
      )}

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
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
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

              {/* Country - State - City Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Country
                  </label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                  >
                    <option value="">Select Country</option>
                    {availableCountries.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    State / Province
                  </label>
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!formData.country}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select State</option>
                    {availableStates.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    City
                  </label>
                  <select
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!formData.state}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {availableCities.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
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
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {item.name}
                      {formData.state && item.product?.bannedStates && item.product.bannedStates.some(id => id.toString() === formData.state.toString()) && (
                        <span className="text-red-500" title="Cannot be delivered to your state">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </span>
                      )}
                    </h4>
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
              {formData.state && (
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax ({taxPercentage}%)</span>
                  <span className="text-white font-bold">
                    +${taxAmount.toFixed(2)}
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
              disabled={submitting || !stripe || bannedProductsInSelectedState.length > 0}
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
