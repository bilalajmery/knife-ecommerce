import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter uppercase text-white block"
            >
              Blade<span className="text-primary">Master</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Forging the finest blades for hunters, chefs, and collectors.
              Quality, durability, and precision in every cut.
            </p>
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <div
                    className="w-5 h-5 bg-current"
                    style={{
                      maskImage: `url('https://cdn.simpleicons.org/${social}')`,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 relative inline-block">
              Shop
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h3>
            <ul className="space-y-4">
              {[
                "Hunting Knives",
                "Kitchen Cutlery",
                "Tactical Gear",
                "Accessories",
                "New Arrivals",
                "Best Sellers",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors text-sm uppercase tracking-wide"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h3>
            <ul className="space-y-4">
              {[
                "Contact Us",
                "FAQs",
                "Shipping Policy",
                "Returns & Exchanges",
                "Warranty Info",
                "Track Order",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors text-sm uppercase tracking-wide"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 relative inline-block">
              Stay Sharp
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h3>
            <p className="text-sm mb-6">
              Join our newsletter for exclusive drops and 10% off your first
              order.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder-gray-600 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-red-700 text-white px-4 py-3 font-bold uppercase tracking-widest text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} BladeMaster. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wide"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
