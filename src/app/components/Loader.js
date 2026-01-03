import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="relative flex items-center justify-center">
        {/* Rotating Outer Ring */}
        <div className="absolute w-40 h-40 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute w-40 h-40 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

        {/* Inner Pulsing Circle */}
        <div className="absolute w-32 h-32 bg-primary/10 rounded-full animate-pulse"></div>

        {/* Logo Image */}
        <div className="relative z-10 flex items-center justify-center">
          <Image
            src="/loader.png"
            alt="KnifeMasters Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
