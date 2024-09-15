// app/page.tsx
'use client';

import ProductInfo from './components/ProductInfo'
// import Map from './components/Map'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <ProductInfo />
      {/* <Map /> */}
    </div>
  )
}