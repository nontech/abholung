// app/page.tsx
'use client';

import { useState, ChangeEvent } from 'react';

interface ProductData {
  title: string;
  price: string;
  description: string;
  // Add other fields as needed
}

export default function ProductSearch() {
  const [url, setUrl] = useState<string>('');
  const [product, setProduct] = useState<ProductData | null>(null);

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/fetch-product-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setProduct(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Product Search</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter eBay Kleinanzeigen URL"
            value={url}
            onChange={handleUrlChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              url ? 'text-black font-medium' : 'text-gray-500'
            }`}
          />
        </div>
        <button
          onClick={fetchProduct}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Fetch Product
        </button>

        {product && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h2>
            <p className="text-lg font-medium text-green-600 mb-2">{product.price}</p>
            <p className="text-gray-700">{product.description}</p>
            {/* Display other product details */}
          </div>
        )}
      </div>
    </div>
  );
}
