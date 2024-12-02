import React, { useState } from "react";
import { Train, Bike, Car, Truck } from "lucide-react";

interface TransportModeSelectorProps {
  onModeChange: (mode: string, needsExtraHelper?: boolean) => void;
}

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  onModeChange,
}) => {
  const [selectedMode, setSelectedMode] = useState<string>(
    "public_transport"
  );
  const [needsExtraHelper, setNeedsExtraHelper] = useState(false);

  const handleModeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const mode = event.target.value;
    setSelectedMode(mode);
    onModeChange(mode, needsExtraHelper);
  };

  const handleHelperChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNeedsExtraHelper(event.target.checked);
    onModeChange(selectedMode, event.target.checked);
  };

  const transportOptions = [
    {
      value: "public_transport",
      label: "Public Transport",
      icon: <Train className="w-6 h-6" />,
      color: "blue",
    },
    {
      value: "bicycle",
      label: "Bicycle",
      icon: <Bike className="w-6 h-6" />,
      color: "green",
    },
    {
      value: "car",
      label: "Car",
      icon: <Car className="w-6 h-6" />,
      color: "red",
    },
    {
      value: "truck",
      label: "Truck",
      icon: <Truck className="w-6 h-6" />,
      color: "yellow",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Select mode of transport
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {transportOptions.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${
                selectedMode === option.value
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            <input
              type="radio"
              value={option.value}
              checked={selectedMode === option.value}
              onChange={handleModeChange}
              className="form-radio h-4 w-4 text-blue-600 hidden"
            />
            <div className="flex items-center space-x-3">
              <div
                className={`${
                  selectedMode === option.value
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                {option.icon}
              </div>
              <span
                className={`
                font-medium
                ${
                  selectedMode === option.value
                    ? "text-blue-700"
                    : "text-gray-700"
                }
              `}
              >
                {option.label}
              </span>
            </div>
            {selectedMode === option.value && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Extra helper checkbox for truck option */}
      {selectedMode === "truck" && (
        <div className="mt-8 flex justify-center">
          <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={needsExtraHelper}
              onChange={handleHelperChange}
              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span>Need an extra person to carry stuff</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default TransportModeSelector;
