import React from "react";
import Image from "next/image";

const Header: React.FC = () => {
  const logoPath = "/images/Logo.svg";
  const tagline =
    "Same-day Pickup & Delivery of your (eBay) Kleinanzeigen Purchase";

  return (
    <header className="w-full py-6">
      <div className="pl-4 max-w-7xl mx-auto">
        {/* Logo and tagline container */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <Image
              src={logoPath}
              alt="Logo"
              width={120}
              height={120}
              className="h-auto w-auto"
              unoptimized
            />
          </a>

          {/* Tagline with enhanced styling */}
          <p
            className="
            font-normal
            text-slate-500
            tracking-wide
            text-sm
            md:text-base
            leading-relaxed
            pl-4
            md:pl-0
            md:ml-8
            max-w-2xl
            font-sans
          "
          >
            {tagline}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
