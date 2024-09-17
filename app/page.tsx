'use client';
import dynamic from 'next/dynamic';

import ProductInfo from './components/ProductInfo'

const Map = dynamic(() => import('./components/Map'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <ProductInfo />
      <Map />
    </div>
  )
}