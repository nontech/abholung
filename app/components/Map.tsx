'use client'

import { useState } from 'react'
import axios from 'axios'

interface RouteInfo {
  distance: number
  duration: number
}

export default function Map() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const geocodeAddress = async (address: string) => {
    const response = await axios.get('/api/get-map-data/geocode', {
      params: { address },
    });
    if (response.data.features && response.data.features.length > 0) {
      return response.data.features[0].geometry.coordinates;
    }
    throw new Error('Address not found');
  };

  const handleRouteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRouteInfo(null);

    try {
      const fromCoords = await geocodeAddress(from);
      const toCoords = await geocodeAddress(to);

      const response = await axios.get('/api/get-map-data/directions', {
        params: {
          start: fromCoords.join(','),
          end: toCoords.join(','),
        },
      });

      const route = response.data.features[0].properties.segments[0];
      setRouteInfo({
        distance: route.distance / 1000, // Convert to km
        duration: route.duration / 60, // Convert to minutes
      });
    } catch (error) {
      setError(`Failed to fetch route information: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  // Function to get route information via API route
  const getRoute = async (fromCoords: number[], toCoords: number[]) => {
    try {
      const response = await axios.post('/api/get-map-data/route', {
        from: fromCoords,
        to: toCoords,
      })
      return response.data
    } catch (error) {
      console.error('Routing error:', error)
      throw error
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Route Planner</h1>
      <form onSubmit={handleRouteSubmit} className="mb-4">
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From (e.g., Berlin, Germany)"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To (e.g., Munich, Germany)"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Get Route'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {routeInfo && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Route Information</h2>
          <p className="text-gray-700">Distance: {routeInfo.distance.toFixed(2)} km</p>
          <p className="text-gray-700">Duration: {routeInfo.duration.toFixed(2)} minutes</p>
        </div>
      )}
    </div>
  )
}
