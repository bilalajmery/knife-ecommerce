"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    router.push("/admin/signin");
  };

  return (
    <aside className="w-64 bg-black border-r border-gray-900 flex flex-col fixed h-full z-20">
      <div className="h-20 flex items-center px-8 border-b border-gray-900">
        <Link href="/admin/home" className="block relative w-14">
          <img
            src="/logo.png"
            alt="BladeMaster Logo"
            className="object-contain w-full h-full"
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <NavItem
          href="/admin/home"
          icon={HomeIcon}
          active={pathname === "/admin/home"}
        >
          Dashboard
        </NavItem>
        <NavItem
          href="/admin/admins"
          icon={UsersIcon}
          active={pathname === "/admin/admins"}
        >
          Admins
        </NavItem>
        <NavItem
          href="/admin/categories"
          icon={TagIcon}
          active={pathname === "/admin/categories"}
        >
          Categories
        </NavItem>
        <NavItem
          href="/admin/products"
          icon={ShoppingBagIcon}
          active={pathname === "/admin/products"}
        >
          Products
        </NavItem>
        <NavItem
          href="/admin/orders"
          icon={CurrencyDollarIcon}
          active={pathname === "/admin/orders"}
        >
          Orders
        </NavItem>
        <NavItem
          href="/admin/users"
          icon={UsersIcon}
          active={pathname === "/admin/users"}
        >
          Users
        </NavItem>

        <NavItem
          href="/admin/analytics"
          icon={ChartBarIcon}
          active={pathname === "/admin/analytics"}
        >
          Analytics
        </NavItem>
        <NavItem
          href="/admin/settings"
          icon={Cog6ToothIcon}
          active={pathname === "/admin/settings"}
        >
          Settings
        </NavItem>
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
  );
}

function NavItem({ href, icon: Icon, children, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        active
          ? "bg-primary text-white shadow-lg shadow-primary/25"
          : "text-gray-400 hover:text-white hover:bg-gray-900"
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {children}
    </Link>
  );
}
