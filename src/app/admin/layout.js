"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Loader from "../components/Loader";

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
    return <Loader />;
  }

  return <>{children}</>;
}





