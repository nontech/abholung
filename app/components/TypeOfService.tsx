import React from "react";

interface TypeOfServiceProps {
  serviceType: "buying" | "selling";
  onServiceChange: (serviceType: "buying" | "selling") => void;
}

export default function TypeOfService({
  serviceType,
  onServiceChange,
}: TypeOfServiceProps) {
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onServiceChange(e.target.value as "buying" | "selling");
  };

  return (
    <div className="flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white ">
        <div className="mb-6 flex items-center justify-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="buying"
              checked={serviceType === "buying"}
              onChange={handleServiceChange}
              className="hidden peer"
            />
            <div className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center peer-checked:bg-emerald-400">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <span className="text-md text-gray-700">Buying</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="selling"
              checked={serviceType === "selling"}
              onChange={handleServiceChange}
              className="hidden peer"
            />
            <div className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center peer-checked:bg-emerald-400">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <span className="text-md text-gray-700">Selling</span>
          </label>
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-center">
          <p className="text-gray-800 text-md">
            You are <strong className="text-emerald-400">{serviceType}</strong>{" "}
            this product
          </p>
        </div>
      </div>
    </div>
  );
}
