"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = () => {
      const storedData = localStorage.getItem("user");
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        // Check if session has expired
        if (parsedData.expiry && Date.now() > parsedData.expiry) {
          localStorage.removeItem("user");
          setUser(null);
        } else {
          setUser(parsedData);
        }
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkSession();

    // Listen for storage events
    const handleStorageChange = () => {
      checkSession();
    };

    window.addEventListener("storage", handleStorageChange);

    // Optional: Check periodically (e.g., every minute) to auto-logout
    const interval = setInterval(checkSession, 60000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsUserMenuOpen(false);
    window.location.href = "/"; // Redirect to home
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block relative w-50">
              <img
                src="/logo.png"
                alt="KnifeMaster Logo"
                className="object-contain w-full h-full"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {["Home", "Shop", "Collections", "About", "Contact"].map(
                (item) => {
                  const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={item}
                      href={href}
                      className={`relative group px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${isActive
                          ? "text-primary"
                          : "text-gray-300 hover:text-white"
                        }`}
                    >
                      {item}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full`}
                      ></span>
                    </Link>
                  );
                }
              )}
            </div>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/wishlist"
              className="text-gray-300 hover:text-primary transition-colors relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            <Link
              href="/cart"
              className="text-gray-300 hover:text-primary transition-colors relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Link>

            {/* User Dropdown (Desktop) */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-300 hover:text-primary transition-colors focus:outline-none flex items-center"
              >
                {user && user.profile ? (
                  <img
                    src={user.profile}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-gray-700"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg py-1 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
                        Hello, {user.name}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full pt-24 px-6 space-y-6">
          {["Home", "Shop", "Collections", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-2xl font-bold uppercase tracking-widest text-white hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="border-t border-gray-800 pt-6 flex flex-col space-y-4">
            <Link
              href="/signin"
              className="text-xl font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-xl font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
