import { ChevronDown, ChevronUp } from "lucide-react";

interface HowItWorksProps {
  isOpen: boolean;
  onToggle: () => void;
  showCollapse?: boolean;
}

const HOW_IT_WORKS_STEPS = [
  {
    title: "Find Your Item",
    description: "Copy the Kleinanzeigen URL of your item",
    icon: "🔍",
  },
  {
    title: "Enter Logistics",
    description: "Select locations, date & time, transport mode",
    icon: "🚚",
  },
  {
    title: "Enter Details",
    description: "Add buyer & seller details",
    icon: "📝",
  },
  {
    title: "Secure Payment",
    description: "Pay securely and track order",
    icon: "💳",
  },
];

const HowItWorks = ({
  isOpen,
  onToggle,
  showCollapse = true,
}: HowItWorksProps) => {
  return (
    <>
      {/* Mobile Version - 2x2 Grid */}
      <div className="md:hidden bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            How It Works
          </h2>
          {showCollapse && (
            <button
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {isOpen && (
          <div className="grid grid-cols-2 gap-3">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Version - Vertical Layout */}
      <div className="hidden md:block bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            How It Works
          </h2>
          {showCollapse && (
            <button
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {isOpen && (
          <div className="space-y-0 mt-6">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex gap-3">
                  <div className="relative z-10 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <span className="text-xl">{step.icon}</span>
                  </div>

                  <div className="pb-8">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div
                    className="absolute left-[15px] top-8 w-[2px] h-[calc(100%-16px)] bg-emerald-200"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HowItWorks;
