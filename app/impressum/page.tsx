export default function Impressum() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Information according to § 5 TMG
          </h1>
          <div className="text-gray-600">
            <p>Kleinanzeigen Kurier</p>
            <p>Donaustraße</p>
            <p>12043 Berlin</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Contact
          </h2>
          <p className="text-gray-600">
            Email:{" "}
            <a
              href="mailto:info@kleinanzeigenkurier.de"
              className="text-emerald-600 hover:text-emerald-700"
            >
              info@kleinanzeigenkurier.de
            </a>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            VAT ID
          </h2>
          <p className="text-gray-600">
            VAT identification number according to Section 27 a of the
            Sales Tax Law:
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Job title and professional regulations
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>Job title: other profession</p>
            <p>Responsible chamber:</p>
            <p>Awarded by:</p>
            <p>The following professional regulations apply:</p>
            <p>Regulations can be viewed at: http://</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Dispute resolution
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              The European Commission provides a platform for online
              dispute resolution (ODR):{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                className="text-emerald-600 hover:text-emerald-700"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p>
              Our email address can be found above in the imprint.
            </p>
            <p>
              We are not willing or obliged to participate in dispute
              resolution proceedings before a consumer arbitration
              board.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Liability for Content
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              As service providers, we are liable for own contents of
              these websites according to Sec. 7, paragraph 1 German
              Telemedia Act (TMG). However, according to Sec. 8 to 10
              German Telemedia Act (TMG), service providers are not
              obligated to permanently monitor submitted or stored
              information or to search for evidences that indicate
              illegal activities.
            </p>
            <p>
              Obligations to remove information or to block the use of
              information in accordance with general laws remain
              unaffected. In this case, liability is only possible at
              the time of knowledge about a specific violation of law.
              If we become aware of such violations of law, we will
              remove this content immediately.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Liability for Links
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              Our offer contains links to external third-party
              websites over whose content we have no influence. We
              therefore cannot accept any liability for this external
              content. The respective provider or operator of the
              pages is always responsible for the content of the
              linked pages.
            </p>
            <p>
              The linked pages were checked for possible legal
              violations at the time of linking. Illegal content was
              not recognizable at the time of linking. However,
              permanent monitoring of the content of linked pages is
              not reasonable without concrete evidence of a legal
              violation. If we become aware of any legal violations,
              we will remove such links immediately.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Copyright
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              The content and works on these pages created by the site
              operators are subject to German copyright law.
              Duplication, processing, distribution and any type of
              exploitation outside the limits of copyright law require
              the written consent of the respective author or creator.
              Downloads and copies of this page are only permitted for
              private, non-commercial use.
            </p>
            <p>
              Insofar as the content on this site was not created by
              the operator, the copyrights of third parties are
              respected. In particular, third-party content is marked
              as such. Should you nevertheless become aware of a
              copyright infringement, please inform us accordingly. If
              we become aware of any infringements, we will remove
              such content immediately.
            </p>
          </div>
        </section>

        <div className="text-sm text-gray-500 mt-8">
          Source:{" "}
          <a
            href="https://www.e-recht24.de"
            className="text-emerald-600 hover:text-emerald-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.e-recht24.de
          </a>
        </div>
      </div>
    </div>
  );
}
