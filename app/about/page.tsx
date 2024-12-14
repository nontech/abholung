export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <div className="mb-12">
          <p className="text-xl text-gray-600 leading-relaxed">
            Welcome to{" "}
            <span className="text-emerald-600 font-semibold">
              Kleinanzeigen Kurier
            </span>
            , your trusted partner for efficient and reliable delivery
            services tailored to your needs.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600">
            At Kleinanzeigen Kurier, we specialize in providing fast,
            safe, and affordable transport solutions for online
            marketplace transactions, including small furniture,
            appliances, and other goods. Whether you're buying or
            selling, our mission is to bridge the gap between
            convenience and cost-effectiveness, ensuring a seamless
            experience for all our customers.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600">
            We are committed to making your life easier by offering a
            hassle-free delivery experience. We know how important it
            is to receive items on time and in perfect condition,
            which is why we treat every order with care, precision,
            and professionalism.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Why Choose Kleinanzeigen Kurier?
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">•</span>
              <span>
                <strong className="text-gray-700">
                  Affordable Prices:
                </strong>{" "}
                Competitive pricing tailored for private and small
                business users.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">•</span>
              <span>
                <strong className="text-gray-700">
                  Reliability:
                </strong>{" "}
                We take pride in delivering on time and as promised.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">•</span>
              <span>
                <strong className="text-gray-700">
                  Flexibility:
                </strong>{" "}
                From single-item deliveries to complex logistics, we
                adapt to your needs.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">•</span>
              <span>
                <strong className="text-gray-700">
                  Transparency:
                </strong>{" "}
                No hidden fees—what you see is what you pay.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">•</span>
              <span>
                <strong className="text-gray-700">
                  Personalized Service:
                </strong>{" "}
                Every delivery is unique, and we treat it that way.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How We Work
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "1",
                title: "Easy Booking",
                desc: "Simply enter your transport details online.",
              },
              {
                number: "2",
                title: "Reliable Pickup",
                desc: "Our couriers collect your items safely and efficiently.",
              },
              {
                number: "3",
                title: "Swift Delivery",
                desc: "We ensure fast and secure transport to your destination.",
              },
            ].map((step, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-emerald-600 font-bold text-xl mb-2">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Our Values
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong className="text-gray-700">
                Customer Satisfaction:
              </strong>{" "}
              Your happiness is our top priority.
            </p>
            <p>
              <strong className="text-gray-700">
                Sustainability:
              </strong>{" "}
              We aim to minimize our environmental impact through
              efficient routing and eco-friendly practices.
            </p>
            <p>
              <strong className="text-gray-700">
                Trust and Safety:
              </strong>{" "}
              We handle every item with care, ensuring it arrives in
              perfect condition.
            </p>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600">
            We're here to answer your questions and help with your
            transport needs. Feel free to reach out via our email
            {"  "}
            <span className="text-emerald-600">
              info@kleinanzeigenkurier.de
            </span>{" "}
            or connect with us on social media.
          </p>
          <p className="text-gray-600 mt-4 font-medium">
            Thank you for choosing Kleinanzeigen Kurier — we look
            forward to serving you!
          </p>
        </section>
      </div>
    </div>
  );
}
