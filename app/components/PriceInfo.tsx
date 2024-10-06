import React from 'react';

const PriceInfo: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-l font-semibold text-gray-700 mb-2">Price Information</h2>
      <div className="flex flex-col">
        <div className="flex justify-between mb-1">
          <span className="text-gray-700">Service Price:</span>
          <span className="text-gray-900">10,00 €</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-700">Platform fee:</span>
          <span className="text-gray-900">2,00 €</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-700">Discount:</span>
          <span className="text-red-400">-4,00 €</span>
        </div>
        <div className="flex justify-between font-bold">
          <span className="text-gray-700">Total Price:</span>
          <span className="text-gray-900">8,00 €</span>
        </div>
      </div>
    </div>
  );
};

export default PriceInfo;