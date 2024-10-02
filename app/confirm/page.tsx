'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapData, ProductData } from '../types/common';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [pickupFrom, setPickupFrom] = useState<string>('Address N/A');
  const [deliverTo, setDeliverTo] = useState<string>('Address N/A');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  

  useEffect(() => {
    const productData = searchParams.get('productData');
    const selectedDate = searchParams.get('selectedDate');
    const selectedTime = searchParams.get('selectedTime');

    if (productData) setProductData(JSON.parse(productData));
    if (selectedDate) setSelectedDate(selectedDate);
    if (selectedTime) setSelectedTime(selectedTime);
  }, [searchParams]);

  useEffect(() => {
    if (mapData && mapData.from && mapData.to) {
      setPickupFrom(mapData.from);
      setDeliverTo(mapData.to);
    } else {
      setPickupFrom('Address N/A');
      setDeliverTo('Address N/A');
    }
  }, [mapData]);


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="text-green-600 text-sm font-medium underline">
          Back
        </Link>
      </div>

      {/* Step Indicator */}
      <div className="text-center text-sm text-gray-500 mb-6">STEP 2 of 2</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup From Section */}
        <div className="bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-semibold mb-4">Pickup From</h2>
          <p className="text-gray-700 mb-4">{pickupFrom}</p>
          <Link href="/edit-pickup" className="text-sm text-blue-600 underline">
            Edit
          </Link>

          <input
            type="text"
            placeholder="Name on the door"
            className="block w-full border border-gray-300 rounded mt-4 p-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="block w-full border border-gray-300 rounded mt-4 p-2"
          />
          <input
            type="text"
            placeholder="+49 - Phone Number"
            className="block w-full border border-gray-300 rounded mt-4 p-2"
          />

          <p className="text-sm text-gray-500 mt-4">
            Please provide the number so we can call/text when picking up the item
          </p>
          <textarea
            placeholder="Extra details ...."
            className="block w-full border border-gray-300 rounded mt-4 p-2 h-24"
          />
        </div>

        {/* Deliver To Section */}
        <div className="bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-semibold mb-4">Deliver To</h2>
          <p className="text-gray-700 mb-4">{deliverTo}</p>
          <Link href="/edit-delivery" className="text-sm text-blue-600 underline">
            Edit
          </Link>

          <input
            type="text"
            placeholder="Name on the door"
            className="block w-full border border-gray-300 rounded mt-4 p-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="block w-full border border-gray-300 rounded mt-4 p-2"
          />
          <input
            type="text"
            placeholder="+49 - Phone Number"
            className="block w-full border border-gray-300 rounded mt-4 p-2"
          />

          <p className="text-sm text-gray-500 mt-4">
            Number only for emergency purposes
          </p>
          <textarea
            placeholder="Extra details ...."
            className="block w-full border border-gray-300 rounded mt-4 p-2 h-24"
          />
        </div>
      </div>

      {/* Product and DateTime Selection */}
      <div className="mt-8 flex justify-center">
        <div className="bg-white p-6 shadow rounded-md text-center w-full max-w-md">
          <p className="text-lg font-semibold">{deliverTo}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="bg-white p-6 shadow rounded-md text-center w-full max-w-md">
          <p className="text-lg font-semibold">{selectedDate}</p>
          <p className="text-gray-500">{selectedTime}</p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-green-600 text-white px-6 py-3 rounded-md">
          CONTINUE →
        </button>
      </div>
    </div>
  );
}
