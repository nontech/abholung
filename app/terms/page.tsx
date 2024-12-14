export default function TermsAndConditions() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          General Terms and Conditions of Kleinanzeigen Kurier
        </h1>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            §1. Services Provided by the Moving Company
          </h2>
          <p className="text-gray-600">
            The moving company undertakes its obligations with the
            customary care of a professional moving service in return
            for the agreed fee. Additional services and unforeseeable
            expenses at the time of contract conclusion must also be
            compensated. This includes services requested by the
            sender after the contract has been finalized. The
            company's duties may encompass furniture
            assembly/disassembly and packing of moving goods.
          </p>
        </section>

        {/* Third-Party Carriers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            §2. Engagement of Third-Party Carriers
          </h2>
          <p className="text-gray-600">
            The moving company reserves the right to subcontract
            another carrier to perform the move.
          </p>
        </section>

        {/* Gratuities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            §3. Gratuities
          </h2>
          <p className="text-gray-600">
            Tips are voluntary and are not included in the company's
            invoice.
          </p>
        </section>

        {/* Cancellation Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            §5. Cancellation and Withdrawal
          </h2>
          <p className="text-gray-600 mb-4">
            In case of cancellation, Sections 415 HGB and 346 ff BGB
            apply. Cancellation fees are:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>20% of total costs after order confirmation.</li>
            <li>
              40% if canceled up to 5 working days before the moving
              date.
            </li>
            <li>
              60% if canceled within 2 working days of the move.
            </li>
            <li>80% if canceled 1 working day before the move.</li>
            <li>100% on the moving day.</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Cancellations must be in writing. The company may
            terminate the contract immediately if the sender violates
            its terms. The company also reserves the right to withdraw
            if doubts arise about the sender's ownership or financial
            capacity or if conditions on moving day make transport
            unsafe. The sender bears any resulting costs.
          </p>
        </section>

        {/* Continue with remaining sections following the same pattern */}

        {/* Payment Terms - Important section highlighted */}
        <section className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            §12. Payment Terms
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              For domestic moves, payment is due before unloading is
              completed. For international moves, payment must be made
              before loading begins. Payments in foreign currency are
              calculated at the applicable exchange rate.
            </p>
            <p>
              If payment is not made, the company may withhold or
              store the goods at the sender's expense in accordance
              with Section 419 HGB.
            </p>
          </div>
        </section>

        {/* Damage Claims - Important section highlighted */}
        <section className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            §14. Damage Claims
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>Claims for loss or damage expire:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                If visible damage is not reported in writing by the
                day after delivery.
              </li>
              <li>
                If non-visible damage is not reported in writing
                within 14 days of delivery. The sender must prove that
                damage occurred during transport.
              </li>
            </ul>
          </div>
        </section>

        {/* Add remaining sections following the same pattern */}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            §18. Governing Law
          </h2>
          <p className="text-gray-600">
            These terms are governed by German law.
          </p>
        </section>

        {/* Last updated info */}
        <div className="text-sm text-gray-500 mt-8">
          Last Updated: December 2024
        </div>
      </div>
    </div>
  );
}
