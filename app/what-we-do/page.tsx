export default function WhatWeDo() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        {/* Introduction Section */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            What We Do
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            At{" "}
            <span className="text-emerald-600 font-semibold">
              Kleinanzeigen Kurier
            </span>
            , we simplify the logistics of buying and selling goods
            online. Whether you&apos;re purchasing a second-hand sofa
            from a marketplace or selling a vintage bicycle to a local
            buyer, we ensure your items are transported quickly,
            safely, and affordably.
          </p>
        </section>

        {/* Our Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Our Services
          </h2>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                1. Furniture & Appliance Delivery
              </h3>
              <p className="text-gray-600">
                Bought or sold furniture and appliances on a
                classified platform? We&apos;ve got you covered. From
                small tables to washing machines, we handle your items
                with care and ensure they reach their destination
                intact.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                2. Small Parcel and Item Transport
              </h3>
              <p className="text-gray-600">
                Not everything requires a large truck. For smaller
                items like electronics, decor, or tools, we offer
                efficient transport solutions at an unbeatable price.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                3. Pickup & Delivery for Online Purchases
              </h3>
              <p className="text-gray-600">
                We specialize in bridging the gap between buyers and
                sellers on popular platforms like eBay Kleinanzeigen
                or Kleinanzeigen. Just tell us the pickup and delivery
                addresses, and we&apos;ll handle the rest.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                4. Flexible Same-Day Delivery
              </h3>
              <p className="text-gray-600">
                Need it fast? Our same-day delivery service ensures
                your items arrive promptly without compromising on
                quality or care.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                5. Customized Logistics Solutions
              </h3>
              <p className="text-gray-600">
                For businesses or unique transport needs, we offer
                tailored services to handle special requests, ensuring
                a seamless delivery experience every time.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "1",
                title: "Book Your Service",
                desc: "Use our website to enter your transport details. Whether it&apos;s a quick delivery or a large item that requires special handling, our booking process is straightforward and transparent.",
              },
              {
                number: "2",
                title: "We Collect Your Items",
                desc: "Our team will pick up your items directly from the designated location, ensuring they are securely packed and ready for transport.",
              },
              {
                number: "3",
                title: "Safe and Timely Delivery",
                desc: "With our well-maintained vehicles and professional drivers, your goods are delivered safely and on time to the desired location.",
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

        {/* Why Choose Us Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Why Choose Us?
          </h2>
          <ul className="space-y-3 text-gray-600">
            {[
              {
                title: "Convenience",
                desc: "No need to rent a van or negotiate with a seller for pickup—leave the logistics to us.",
              },
              {
                title: "Affordability",
                desc: "Our services are priced competitively to fit your budget.",
              },
              {
                title: "Reliability",
                desc: "We treat every item as if it were our own, guaranteeing safe transport.",
              },
              {
                title: "Flexibility",
                desc: "Whether it&apos;s a one-time delivery or ongoing needs, we&apos;ve got you covered.",
              },
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-emerald-500 mr-2">•</span>
                <span>
                  <strong className="text-gray-700">
                    {item.title}:
                  </strong>{" "}
                  {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Let Us Help You Today!
          </h2>
          <p className="text-gray-600">
            No matter the size, destination, or urgency of your
            transport needs,
            <span className="text-emerald-600 font-semibold">
              {" "}
              Kleinanzeigen Kurier{" "}
            </span>
            is here to help. Experience stress-free, reliable delivery
            services by booking with us today.
          </p>
        </section>
      </div>
    </div>
  );
}
