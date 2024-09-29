'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import type { ProductData, MapData } from '../../types/common';

const Details = () => {
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const productDataParam = searchParams.get('productData');
    const mapDataParam = searchParams.get('mapData');
    const selectedDateParam = searchParams.get('selectedDate');
    const selectedTimeParam = searchParams.get('selectedTime');

    if (productDataParam) setProductData(JSON.parse(productDataParam));
    if (mapDataParam) setMapData(JSON.parse(mapDataParam));
    if (selectedDateParam) setSelectedDate(selectedDateParam);
    if (selectedTimeParam) setSelectedTime(selectedTimeParam);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Suspense fallback={<div>Loading...</div>}>
            <div className="mt-4 p-4 bg-white rounded shadow-md w-full max-w-md">
                <h2 className="text-lg font-bold mb-2">Details Page</h2>
                <pre className="text-sm text-gray-700">
                <strong>Product Data:</strong> {JSON.stringify(productData, null, 2)}
                </pre>
                <pre className="text-sm text-gray-700">
                <strong>Map Data:</strong> {JSON.stringify(mapData, null, 2)}
                </pre>
                <pre className="text-sm text-gray-700">
                <strong>Selected Date:</strong> {selectedDate || 'N/A'}
                </pre>
                <pre className="text-sm text-gray-700">
                <strong>Selected Time:</strong> {selectedTime || 'N/A'}
                </pre>
            </div>
      </Suspense>
    </div>
  );
};

export default Details;