import React from 'react';
import { DeliveryDetails } from '../../types/common';


interface DeliveryInfoProps {
  pickupDetails: DeliveryDetails;
  deliveryDetails: DeliveryDetails;
}

const SummaryPage: React.FC<DeliveryInfoProps> = ({ pickupDetails, deliveryDetails }) => {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-green-600 mb-8 text-center">
          Your Kleinanzeigen item delivery is being processed!
        </h1>
  
        {/* Delivery Info Section */}
        <div className="w-full max-w-4xl flex justify-between space-x-6">
          {/* Pickup Info */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-1/2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Pickup From</h3>
            <p className="text-gray-600">{pickupDetails.name}</p>
            <p className="text-gray-600">{pickupDetails.address}</p>
            <p className="text-gray-600 mt-4">{pickupDetails.time}</p>
          </div>
  
          {/* Delivery Info */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-1/2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery To</h3>
            <p className="text-gray-600">{deliveryDetails.name}</p>
            <p className="text-gray-600">{deliveryDetails.address}</p>
            <p className="text-gray-600 mt-4">{deliveryDetails.time}</p>
          </div>
        </div>
  
        {/* Footer */}
        <div className="mt-10 text-center text-gray-500">
          <p>Expect to hear from us shortly!</p>
          <p className="mt-2">
            Need to cancel? Let us know at least 3 hours before delivery, and we’ll issue a full refund—no questions asked.
          </p>
        </div>
  
        {/* Button */}
        <button
          className="mt-8 px-6 py-3 bg-green-500 text-white text-lg font-medium rounded-md shadow-md hover:bg-green-600 transition duration-300"
          onClick={() => alert('Deliver another item')}
        >
          Deliver another item
        </button>
      </div>
    );
  };
  
  export default SummaryPage;
  