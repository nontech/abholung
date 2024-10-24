'use client'

import { useState, ChangeEvent } from 'react'
import type { ProductData } from '../../types/common'
import { Tooltip } from 'react-tooltip'

interface ProductInfoProps {
  onProductFetched: (product: ProductData) => void;
  url: string;
  onUrlChange: (url: string) => void;
  productError: string;
}

export default function ProductInfo({ onProductFetched, url, onUrlChange, productError }: ProductInfoProps) {
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

  const clearUrl = () => {
    onUrlChange('')
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">eBay Kleinanzeigen Product Link</h1>
        <div className="ml-2 text-gray-500 cursor-pointer" data-tooltip-id="product-link-help">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <Tooltip id="product-link-help" place="top" float={true}>
          <div>
            <p>To get the product link:</p>
            <ol className="list-decimal pl-4 mt-2">
              <li>Go to the eBay Kleinanzeigen product page</li>
              <li>Copy the URL from your browser address bar</li>
              <li>Paste it into the input field below</li>
            </ol>
          </div>
        </Tooltip>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Paste eBay Kleinanzeigen product link here"
          value={url}
          onChange={handleUrlChange}
          className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            url ? 'text-black font-medium' : 'text-gray-500'
          }`}
          disabled={loading}
        />
        {productError && <p className="text-red-500 text-sm mt-1">{productError}</p>}
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
    </div>
  )
}
