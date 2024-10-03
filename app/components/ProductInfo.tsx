'use client'

import { useState, ChangeEvent} from 'react'
import Image from 'next/image'
import type { ProductData } from '../../types/common'

interface ProductInfoProps {
  product: ProductData | null;
  onProductFetched: (product: ProductData) => void;
}


export default function ProductInfo({ product, onProductFetched }: ProductInfoProps) {
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const fetchProduct = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/fetch-product-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
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
    setUrl(e.target.value)
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Product Search</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Kleinanzeigen URL"
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
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Fetch Product'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {product && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h2>
          {product.pic_url && (
            <div className="flex justify-center items-center">
              <Image src={product.pic_url} alt={product.title} width={200} height={200} />
            </div>
          )}
          <p className="text-lg font-medium text-green-600 mb-2">{product.price}</p>
          <p className="text-gray-700">Listed by: {product.listed_by}</p>
          <p className="text-gray-700">Pickup Address: {product.address}</p>
        </div>
      )}
    </div>
  )
}
