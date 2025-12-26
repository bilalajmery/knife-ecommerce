"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [randomCategories, setRandomCategories] = useState([]);

  useEffect(() => {
    const fetchRandomCategories = async () => {
      try {
        const res = await fetch("/api/categories/random");
        const data = await res.json();
        if (data.success) {
          setRandomCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch footer categories:", error);
      }
    };
    fetchRandomCategories();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-950 to-black text-gray-400 border-t border-gray-800 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/"
              className="block w-60 h-24 hover:scale-105 transition-transform duration-300"
            >
              <img
                src="/logo.png"
                alt="KnifeMaster Logo"
                className="object-contain w-full h-full"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-gray-400">
              Forging the finest blades for hunters, chefs, and collectors since
              2010. Quality, durability, and precision in every cut. Trusted by
              professionals worldwide.
            </p>

            {/* Social Media Icons */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">
                Connect With Us
              </h4>
              <div className="flex space-x-3">
                {[
                  {
                    name: "facebook",
                    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  },
                  {
                    name: "twitter",
                    icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                  },
                  {
                    name: "instagram",
                    icon: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
                  },
                  {
                    name: "youtube",
                    icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="group relative w-11 h-11 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center hover:from-primary hover:to-red-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-primary/50"
                    aria-label={social.name}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="uppercase tracking-wide">
                  100% Authentic Products
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span className="uppercase tracking-wide">
                  Free Shipping Over $99
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="uppercase tracking-wide">
                  Lifetime Warranty
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links / Dynamic Categories */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 relative inline-block">
              Shop Collections
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {randomCategories.length > 0 ? (
                randomCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={cat.link}
                      className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-200"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                ["Best Sellers", "New Arrivals", "Hunting", "Tactical", "Kitchen", "Folding"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/shop"
                      className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-200"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                      {item}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", href: "/contact" },
                { name: "FAQs", href: "/faq" },
                { name: "Shipping Policy", href: "/shipping-policy" },
                { name: "Returns & Exchanges", href: "/returns-exchanges" },
                { name: "Warranty Info", href: "/warranty-hub" },
                { name: "Track Order", href: "/track-order" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 relative inline-block">
              Stay Sharp
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-transparent"></span>
            </h3>
            <p className="text-sm mb-6 text-gray-400 leading-relaxed">
              Join our newsletter for exclusive drops, expert tips, and{" "}
              <span className="text-primary font-semibold">10% off</span> your
              first order.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-white px-4 py-3.5 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder-gray-500 text-sm group-hover:border-gray-600"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="w-full bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary text-white px-4 py-3.5 rounded-lg font-bold uppercase tracking-widest text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {subscribed ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Subscribed!
                  </span>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods & Certifications */}
        <div className="border-t border-gray-800 pt-10 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 mb-8">
            <div className="text-center md:text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                Secure Payment Methods
              </h4>
              <div className="flex items-center space-x-4 flex-wrap justify-center md:justify-start gap-2">
                {["Visa", "Mastercard", "PayPal", "Amex", "Apple Pay"].map(
                  (method) => (
                    <div
                      key={method}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 px-4 py-2 rounded-md text-xs font-semibold text-gray-400 hover:border-primary hover:text-white transition-all duration-200"
                    >
                      {method}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                Certified & Trusted
              </h4>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 px-3 py-2 rounded-md">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 px-3 py-2 rounded-md">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} KnifeMaster. All rights reserved.
            Crafted with precision and passion.
          </p>
          <div className="flex flex-wrap justify-center space-x-6">
            {[
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Terms of Service", href: "/terms-of-service" },
              { name: "Cookie Policy", href: "/cookie-policy" },
              { name: "Sitemap", href: "/site-map" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs text-gray-500 hover:text-primary transition-colors uppercase tracking-wide hover:underline underline-offset-4"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
