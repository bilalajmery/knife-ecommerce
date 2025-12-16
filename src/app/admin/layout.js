"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedAdmin = localStorage.getItem("adminUser");
      const isSignInPage = pathname === "/admin/signin";

      if (storedAdmin) {
        // User is logged in
        if (isSignInPage) {
          // If on signin page, redirect to dashboard
          router.push("/admin/home");
        } else {
          // If on other pages, allow access
          setIsLoading(false);
        }
      } else {
        // User is NOT logged in
        if (!isSignInPage) {
          // If not on signin page, redirect to signin
          router.push("/admin/signin");
        } else {
          // If on signin page, allow access
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
