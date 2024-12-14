export default function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Data Protection
          </h1>
          <p className="text-gray-600">
            We take your privacy seriously. At{" "}
            <span className="font-semibold">
              Kleinanzeigen Kurier
            </span>
            , we strictly adhere to the provisions of the General Data
            Protection Regulation (GDPR) and the Federal Data
            Protection Act (BDSG). Our technical and organizational
            measures are designed to meet statutory data protection
            requirements. For detailed information, please refer to
            our{" "}
            <a
              href="/privacy-policy"
              className="text-emerald-600 hover:text-emerald-700"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Data Controller
          </h2>
          <div className="text-gray-600">
            <p className="font-semibold">
              Managing Director: Philip Tapiwa
            </p>
            <p>Kleinanzeigen Kurier</p>
            <p>Donaustraße</p>
            <p>12043 Berlin</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Changes to Our Privacy Policy
          </h2>
          <p className="text-gray-600">
            As technology evolves, we may update our security and data
            protection measures to ensure continued compliance with
            current standards. Please review the latest version of our
            Privacy Policy regularly. If you do not agree with the
            terms of the policy or any changes, your only option is to
            discontinue using our website.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Data Processing
          </h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Order Data Processing
          </h3>
          <p className="text-gray-600">
            In most cases, we act as the data controller. For specific
            services, we engage service providers bound by data
            processing agreements that comply with GDPR standards.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Rights
          </h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Right to Information
          </h3>
          <div className="text-gray-600">
            <p>
              You can request details about the data we hold about you
              at any time by contacting:
            </p>
            <ul className="list-none mt-4 space-y-2">
              <li>
                <strong>Address:</strong> Donaustraße 12043 Berlin
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@kleinanzeigenkurier.de"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  info@kleinanzeigenkurier.de
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cookies
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              We use cookies to improve your experience. These cookies
              do not store personal data, including IP addresses. You
              can disable cookies in your browser settings if you
              prefer. Instructions can be found in your browser's help
              section. Note: Some website functions may not work
              properly without cookies.
            </p>
            <p>
              We may also use Google Analytics to analyze website
              traffic. For more information, refer to Google's Privacy
              Policy and Opt-Out Options.
            </p>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600">
            For questions, complaints, or suggestions about our
            privacy practices, please reach out to us via our{" "}
            <span className="text-emerald-600">
              info@kleinanzeigenkurier.de
            </span>{" "}
            .
          </p>
        </section>

        <div className="text-sm text-gray-500 mt-8">
          Last Updated: December 2024
        </div>
      </div>
    </div>
  );
}
