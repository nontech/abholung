import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                Contact
              </h3>
              <p>
                <a
                  href="mailto:info@kleinanzeigenkurier.de"
                  className="hover:text-gray-800 transition-colors"
                >
                  info@kleinanzeigenkurier.de
                </a>
              </p>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="hover:text-gray-800 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-800 transition-colors"
                >
                  Imprint
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-800 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-800 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-sm">
            Copyright © {new Date().getFullYear()} Kleinanzeigen
            Kurier GmbH
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
