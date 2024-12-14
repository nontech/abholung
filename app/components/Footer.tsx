import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 py-12 mt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content - Four Columns */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr,1fr,1fr] gap-x-16 gap-y-8 mb-16">
          {/* Section A - Logo and Description */}
          <div className="space-y-6 md:pr-8">
            <div className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Kleinanzeigen Kurier"
                width={140}
                height={32}
                unoptimized
              />
            </div>
            <p className="text-gray-500 leading-relaxed">
              Your trusted delivery partner for Kleinanzeigen
              purchases in Berlin.
              <br />
              <br />
              We make buying and selling easier with secure and
              reliable pickup and delivery.
            </p>
          </div>

          {/* Section B - Contact Us */}
          <div>
            <h3 className="font-semibold text-gray-800 text-lg mb-6">
              Contact Us
            </h3>
            <div className="space-y-4">
              <p>
                <a
                  href=""
                  className="hover:text-gray-800 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@kleinanzeigenkurier.de
                </a>
              </p>
              <p className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Berlin, Germany
              </p>
            </div>
          </div>

          {/* Section C - Company */}
          <div>
            <h3 className="font-semibold text-gray-800 text-lg mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="hover:text-gray-800 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/what-we-do"
                  className="hover:text-gray-800 transition-colors"
                >
                  What we do
                </Link>
              </li>
            </ul>
          </div>

          {/* Section D - Legal */}
          <div>
            <h3 className="font-semibold text-gray-800 text-lg mb-6">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/impressum"
                  className="hover:text-gray-800 transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-gray-800 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gray-800 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row - Copyright and Trust Indicators */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Copyright © {new Date().getFullYear()} Kleinanzeigen
              Kurier GmbH. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[#0CA957]">
              {/* Secure Payment Icon */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-sm">Secure Payment</span>
              </div>

              {/* HTTPS Icon */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-sm">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
