"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  TagIcon,
  TicketIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  MapIcon,
  BuildingOffice2Icon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    router.push("/admin/signin");
  };

  const navItems = [
    { href: "/admin/home", icon: HomeIcon, label: "Dashboard" },
    { href: "/admin/admins", icon: UsersIcon, label: "Admins" },
    { href: "/admin/categories", icon: TagIcon, label: "Collections" },
    { href: "/admin/countries", icon: GlobeAltIcon, label: "Countries" },
    { href: "/admin/states", icon: MapIcon, label: "States" },
    { href: "/admin/cities", icon: BuildingOffice2Icon, label: "Cities" },
    { href: "/admin/products", icon: ShoppingBagIcon, label: "Products" },
    { href: "/admin/promos", icon: TicketIcon, label: "Promo Codes" },
    { href: "/admin/orders", icon: CurrencyDollarIcon, label: "Orders" },
    { href: "/admin/subscribers", icon: EnvelopeIcon, label: "Subscribers" },
    { href: "/admin/contact-messages", icon: ChatBubbleLeftRightIcon, label: "Messages" },
    { href: "/admin/users", icon: UsersIcon, label: "Users" },
    { href: "/admin/analytics", icon: ChartBarIcon, label: "Analytics" },
    { href: "/admin/settings", icon: Cog6ToothIcon, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-primary rounded-lg shadow-lg text-white"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-gray-900 flex flex-col transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-20 flex items-center px-8 border-b border-gray-900">
          <Link href="/admin/home" className="block relative w-44">
            <img
              src="/logo.png"
              alt="KnifeMasters Logo"
              className="object-contain w-full h-full"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              active={pathname === item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-900">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ href, icon: Icon, children, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${active
        ? "bg-primary text-white shadow-lg shadow-primary/25 font-bold"
        : "text-gray-400 hover:text-white hover:bg-gray-900"
        }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {children}
    </Link>
  );
}
