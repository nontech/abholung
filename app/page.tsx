'use client';
import dynamic from 'next/dynamic';
import ProductInfo from './components/ProductInfo';
import DateInput from './components/DateInput';
import TimePicker from './components/TimePicker';
import type { ProductData, MapData } from '../types/common';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Map = dynamic(() => import('./components/Map'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');


  const handleNavigate = () => {
    const query = new URLSearchParams({
      productData: JSON.stringify(productData),
      mapData: JSON.stringify(mapData),
      selectedDate: selectedDate?.toISOString() || '',
      selectedTime: selectedTime || '',
    });
    router.push(`/details?${query.toString()}`);

  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <ProductInfo product={productData} onProductFetched={setProductData} />
      <Map onChange={setMapData} />
      <DateInput value={selectedDate} onChange={(date) => setSelectedDate(date[0])} />
      <TimePicker selectedTime={selectedTime} onTimeChange={setSelectedTime} />
      <button onClick={handleNavigate} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Continue
      </button>
    </div>
  );
}