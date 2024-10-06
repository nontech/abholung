'use client'

import { useState, ChangeEvent } from 'react'
import Image from 'next/image'
import type { ProductData } from '../../types/common'
import TypeOfService from './TypeOfService';

interface ProductInfoProps {
  product: ProductData | null;
  onProductFetched: (product: ProductData) => void;
  serviceType: 'buying' | 'selling';
  onServiceChange: (serviceType: 'buying' | 'selling') => void;
  url: string;
  onUrlChange: (url: string) => void;
}

export default function ProductInfo({ product, serviceType, onProductFetched, onServiceChange, url, onUrlChange }: ProductInfoProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchProduct = async (newUrl: string) => {
    setLoading(true)
    setError('')
    console.log("fetchProduct $url", newUrl);
    console.log(JSON.stringify({ newUrl }));

    try {
      const response = await fetch('/api/fetch-product-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUrl }),
      })
      const data = await response.json()

      if (response.ok) {
        data.url = url
        onProductFetched(data)
      } else {
        setError(data.error || 'Failed to fetch product info')
      }
    } catch (error) {
      setError('Error fetching product')
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    onUrlChange(newUrl);
  
    // Simple URL validation using the newly updated URL
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };
  
    // Check if the URL is a "kleinanzeigen" link
    const isKleinanzeigenUrl = (url: string) => {
      return url.includes("kleinanzeigen");
    };
  
    if (isValidUrl(newUrl) && isKleinanzeigenUrl(newUrl)) {
      console.log("validated_url", newUrl);
      fetchProduct(newUrl);
    }
  }
  

  // const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter' && !loading) {
  //     fetchProduct()
  //   }
  // }

  const clearUrl = () => {
    onUrlChange('')
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 text-gray-800">eBay Kleinanzeigen Product Link</h1>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Paste eBay Kleinanzeigen product link here"
          value={url}
          onChange={handleUrlChange}
          //onKeyDown={handleKeyPress}
          className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            url ? 'text-black font-medium' : 'text-gray-500'
          }`}
          disabled={loading}
        />
        {url && (
          <button
            onClick={clearUrl}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {loading && <p className="text-blue-500 mt-4 pl-4">Fetching product information...</p>}
      {error && <p className="text-red-500 mt-4 pl-4">{error}</p>}

      {product && (
        <div className="mt-6 max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h2>
            {product.pic_url && (
              <div className="flex justify-center items-center mb-4">
                <Image src={product.pic_url} alt={product.title} width={200} height={200} className="rounded-md" />
              </div>
            )}
            <p className="text-lg font-medium text-green-600 mb-2">{product.price}</p>
            <p className="text-gray-700 mb-1"> <strong className="text-black-600">Listed by: </strong>{product.listed_by}</p>
            <p className="text-gray-700"><strong className="text-black-600">Pickup Address: </strong>{product.address}</p>
          </div>
          <hr className="my-4 border-2 border-grey-300" />
          <TypeOfService onServiceChange={onServiceChange} serviceType={serviceType} />
        </div>
      )}
    </div>
  )
}
