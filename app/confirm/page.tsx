'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    const productData = searchParams.get('productData');
    const mapData = searchParams.get('mapData');
    const selectedDate = searchParams.get('selectedDate');
    const selectedTime = searchParams.get('selectedTime');

    if (productData) setProductData(JSON.parse(productData));
    if (mapData) setMapData(JSON.parse(mapData));
    if (selectedDate) setSelectedDate(selectedDate);
    if (selectedTime) setSelectedTime(selectedTime);
  }, [searchParams]);

  return (
    <div>
        <Link href="/" className="mb-4 text-blue-500 underline">
                Back
            </Link>
      <h1>Confirm Page</h1>
      <p>Product Data: {JSON.stringify(productData)}</p>
      <p>Map Data: {JSON.stringify(mapData)}</p>
      <p>Selected Date: {selectedDate}</p>
      <p>Selected Time: {selectedTime}</p>
    </div>
  );
}
