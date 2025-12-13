"use client";
import { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";

export default function Template({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}
