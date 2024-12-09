import React from "react";

interface ProgressBarProps {
  currentStep: number; // 1, 2, or 3 to indicate the current step
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center">
      {/* Step 1 */}
      <div className="flex-1 text-center">
        <div
          className={`h-1 ${
            currentStep >= 1 ? "bg-emerald-600" : "bg-gray-300"
          }`}
        ></div>
        <p
          className={`mt-2 ${
            currentStep >= 1 ? "text-emerald-600" : "text-gray-500"
          } font-medium`}
        >
          Step 1 - Search
        </p>
      </div>

      {/* Gap between Step 1 and Step 2 */}
      <div className="w-8"></div>

      {/* Step 2 */}
      <div className="flex-1 text-center">
        <div
          className={`h-1 ${
            currentStep >= 2 ? "bg-emerald-600" : "bg-gray-300"
          }`}
        ></div>
        <p
          className={`mt-2 ${
            currentStep >= 2 ? "text-emerald-600" : "text-gray-500"
          } font-medium`}
        >
          Step 2 - Details
        </p>
      </div>

      {/* Gap between Step 2 and Step 3 */}
      <div className="w-8"></div>

      {/* Step 3 */}
      <div className="flex-1 text-center">
        <div
          className={`h-1 ${
            currentStep >= 3 ? "bg-emerald-600" : "bg-gray-300"
          }`}
        ></div>
        <p
          className={`mt-2 ${
            currentStep >= 3 ? "text-emerald-600" : "text-gray-500"
          } font-medium`}
        >
          Step 3 - Payment
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;
