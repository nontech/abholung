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
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="buying"
            checked={serviceType === "buying"}
            onChange={handleServiceChange}
            className="hidden peer"
          />
          <div className="w-4 h-4 rounded-full border-2 border-emerald-400 flex items-center justify-center peer-checked:bg-emerald-400">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-lg text-gray-700">Buying</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="selling"
            checked={serviceType === "selling"}
            onChange={handleServiceChange}
            className="hidden peer"
          />
          <div className="w-4 h-4 rounded-full border-2 border-emerald-400 flex items-center justify-center peer-checked:bg-emerald-400">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-lg text-gray-700">Selling</span>
        </label>
      </div>
      <div className="text-lg text-gray-500 italic justify-center flex gap-1">
        <span>You are</span>
        <span className="text-emerald-600 font-medium">{serviceType}</span>
        <span>this product</span>
      </div>
    </div>
  );
}
