import React, { useState } from "react";
import { Train, Bike, Car, Truck } from "lucide-react";

interface TransportModeSelectorProps {
  onModeChange: (mode: string, needsExtraHelper?: boolean) => void;
}

const CargoBikeIcon = () => (
  <svg
    viewBox="0 0 300 202"
    width="100"
    height="100"
    className="w-12 h-12"
    fill="currentColor"
    stroke="none"
  >
    <g transform="translate(0.000000,202.000000) scale(0.100000,-0.100000)">
      <path d="M1119 1651 c-33 -32 -39 -45 -39 -80 0 -81 50 -134 126 -134 73 0 125 50 126 120 1 81 -51 133 -133 133 -35 0 -48 -6 -80 -39z" />
      <path d="M972 1405 c-17 -14 -67 -90 -112 -170 -72 -128 -82 -150 -77 -181 3 -20 12 -43 19 -52 7 -8 70 -53 139 -98 l127 -82 7 -139 c7 -145 17 -177 58 -192 28 -10 74 5 87 29 6 11 10 106 10 214 l0 196 -90 71 c-49 39 -90 73 -90 75 0 3 12 28 26 56 l26 50 26 -30 c39 -44 200 -90 217 -62 3 6 25 10 49 10 42 0 43 -1 55 -42 7 -24 15 -51 17 -60 5 -16 -4 -18 -90 -18 l-95 0 14 -32 c11 -27 19 -34 49 -36 l36 -3 -40 -56 c-32 -45 -40 -65 -40 -100 0 -23 4 -43 8 -43 5 0 41 45 81 100 71 99 95 117 105 83 28 -95 86 -312 86 -323 0 -11 -27 -12 -139 -7 l-139 7 -5 -33 c-2 -17 -4 -33 -3 -34 1 -1 99 -5 219 -10 l218 -8 18 -52 c37 -109 115 -172 225 -180 140 -12 262 92 274 232 13 151 -102 275 -254 275 -34 0 -78 -7 -98 -15 -57 -24 -112 -80 -137 -140 -20 -48 -26 -55 -51 -55 -23 0 -28 4 -28 23 0 68 98 190 184 228 187 82 407 -36 447 -243 11 -55 13 -58 40 -58 34 0 69 31 69 62 0 11 7 111 16 220 17 210 15 243 -14 252 -9 3 -213 12 -452 21 -239 9 -440 18 -447 20 -7 2 -15 20 -19 40 -8 42 -28 55 -85 55 -28 0 -50 7 -63 19 -12 10 -44 26 -73 35 -45 15 -53 22 -64 54 -23 75 -42 103 -84 127 -57 34 -123 34 -163 0z m1101 -719 c59 -24 117 -111 117 -176 0 -98 -94 -190 -195 -190 -82 0 -166 64 -181 137 l-6 30 102 -1 c89 -1 104 1 114 17 20 33 -16 47 -121 47 -51 0 -93 2 -93 5 0 3 6 20 14 38 37 88 156 133 249 93z" />
      <path d="M808 840 c-16 -28 -28 -38 -38 -34 -80 34 -189 22 -263 -27 -87 -57 -127 -136 -127 -248 0 -215 233 -350 422 -244 62 35 119 105 139 171 12 39 19 48 42 50 22 3 27 8 27 33 0 25 -4 29 -29 29 -25 0 -30 5 -36 33 -11 48 -33 88 -72 128 l-35 37 26 40 26 41 -22 16 c-31 21 -35 20 -60 -25z m-75 -88 c15 -7 10 -20 -43 -106 -83 -134 -82 -136 71 -136 128 0 130 -1 110 -53 -16 -40 -73 -99 -116 -118 -22 -10 -61 -19 -86 -19 -88 0 -154 36 -197 110 -22 37 -27 57 -27 110 1 95 44 162 130 201 40 19 124 24 158 11z m131 -117 c29 -60 25 -65 -59 -65 -41 0 -75 4 -75 9 0 5 17 37 37 70 l38 60 22 -21 c12 -11 29 -35 37 -53z" />
    </g>
  </svg>
);

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  onModeChange,
}) => {
  const [selectedMode, setSelectedMode] = useState<string>(
    "public_transport"
  );
  const [needsExtraHelper, setNeedsExtraHelper] = useState(false);
  const [otherModeText, setOtherModeText] = useState("");

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

  const handleOtherModeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value;
    setOtherModeText(text);
    onModeChange(`other:${text}`);
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
      value: "cargo_bike",
      label: "Cargo Bike",
      icon: <CargoBikeIcon />,
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
    {
      value: "other",
      label: "Other",
      icon: null,
      color: "gray",
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
            <div className="flex flex-col w-full">
              <div className="flex items-center space-x-3">
                {option.icon && (
                  <div
                    className={`${
                      selectedMode === option.value
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {option.icon}
                  </div>
                )}
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

              {/* Embed input field for Other option */}
              {option.value === "other" &&
                selectedMode === "other" && (
                  <input
                    type="text"
                    value={otherModeText}
                    onChange={handleOtherModeChange}
                    placeholder="Please specify"
                    className="mt-2 w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
            </div>
            {selectedMode === option.value && (
              <div className="absolute right-4 top-4">
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

      {/* Extra helper checkbox for car and truck options */}
      {(selectedMode === "truck" || selectedMode === "car") && (
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