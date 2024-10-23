import React from 'react';
import { DeliveryDetails } from '../../types/common';
import Image from 'next/image';

interface DeliveryInfoProps {
  pickupDetails: DeliveryDetails;
  deliveryDetails: DeliveryDetails;
}

const confetti = '/images/confetti.png';

// Utility function to format a date
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};
const SummaryPage: React.FC<DeliveryInfoProps> = ({ pickupDetails, deliveryDetails }) => {
  const pickupDate = formatDate(pickupDetails.date ?? '');
  const deliveryDate = formatDate(deliveryDetails.date ?? '');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="flex justify-center mb-6">
            <Image
              src={confetti}
              alt="Celebration"
              width={100}
              height={100}
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-green-600 mb-6 text-center">
            Your Kleinanzeigen item delivery is being processed!
          </h1>

          <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
            <div className="bg-white shadow rounded-lg p-4 md:w-1/2">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Pickup From</h3>
              <p className="text-gray-600">{pickupDetails.name}</p>
              <p className="text-gray-600">{pickupDetails.address}</p>
              <p className="text-gray-600">{pickupDetails.time}</p>
              <p className="text-gray-600">{pickupDate}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 md:w-1/2">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Delivery To</h3>
              <p className="text-gray-600">{deliveryDetails.name}</p>
              <p className="text-gray-600">{deliveryDetails.address}</p>
              <p className="text-gray-600">{deliveryDetails.time}</p>
              <p className="text-gray-600">{deliveryDate}</p>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm md:text-base">
            <p>Expect to hear from us shortly!</p>
            <p className="mt-2">
              Need to cancel? Let us know at least 3 hours before delivery, and we'll issue a full refund—no questions asked.
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="w-full md:w-auto md:px-8 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-md hover:bg-green-600 transition duration-300"
              onClick={() => window.location.href = '/'}
            >
              Order Another Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
