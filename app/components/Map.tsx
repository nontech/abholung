'use client'

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import AutocompleteInput from './AutocompleteInput';
import { getDistance } from 'geolib';
import 'leaflet/dist/leaflet.css';
import { RouteInfo, MapData } from '../../types/common';

// Define a more specific type for the Leaflet icon prototype
interface ExtendedIconOptions extends L.IconOptions {
  _getIconUrl?: string;
}

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as Partial<ExtendedIconOptions>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});


// Define custom icon using online image URLs
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface GeocodeResponse {
  features: {
    geometry: {
      coordinates: [number, number];
    };
  }[];
}

// Add this interface near the top of the file, with other interfaces
interface RouteResponse {
  features: [{
    properties: {
      segments: [{
        distance: number;
        duration: number;
      }];
    };
    geometry: {
      coordinates: [number, number][];
    };
  }];
}

function ChangeView({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords.map(coord => [coord[1], coord[0]]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, coords]);
  return null;
}

interface MapProps {
  onChange: (mapInfo: MapData) => void;
}

export default function Map({onChange}: MapProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const geocodeAddress = async (address: string): Promise<[number, number]> => {
    const response = await axios.get<GeocodeResponse>('/api/get-map-data/geocode', {
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
    // call the callback function with the map data
    onChange({ from, to });

    try {
      const fromCoordinates = fromCoords || await geocodeAddress(from);
      const toCoordinates = toCoords || await geocodeAddress(to);

      const distanceInMeters = getDistance(
        { latitude: fromCoordinates[1], longitude: fromCoordinates[0] },
        { latitude: toCoordinates[1], longitude: toCoordinates[0] }
      );

      if (distanceInMeters > 6000000) {
        setError('Route distance exceeds 6000 km limit. Please choose closer locations.');
        return;
      }

      const response = await axios.get<RouteResponse>('/api/get-map-data/directions', {
        params: {
          start: fromCoordinates.join(','),
          end: toCoordinates.join(','),
        },
      });

      const route = response.data.features[0].properties.segments[0];
      const coordinates = response.data.features[0].geometry.coordinates;
      setRouteInfo({
        distance: route.distance / 1000, // Convert to km
        duration: route.duration / 60, // Convert to minutes
        coordinates: coordinates,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Failed to fetch route information: ${axiosError.message}`);
      console.error('Error:', axiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleRouteSubmit} className="mb-4">
        <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Pickup From
        </label>
          <AutocompleteInput
            value={from}
            onChange={(value, coords) => {
              setFrom(value);
              setFromCoords(coords || null);
            }}
            placeholder="From"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Deliver To
          </label>
          <AutocompleteInput
            value={to}
            onChange={(value, coords) => {
              setTo(value);
              setToCoords(coords || null);
            }}
            placeholder="To"
          />
        </div>
        <button
          type="submit"
          className="w-1/4 p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Get Route'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {routeInfo && (
        <div className="flex w-full">
           <div className="w-1/3 p-4">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Route Information</h2>
              <div className="space-y-4">
                <p className="text-xl">
                  <span className="text-blue-700">Distance:</span>{' '}
                  <span className="text-gray-900">{routeInfo.distance.toFixed(2)} km</span>
                </p>
                <p className="text-xl">
                  <span className="text-blue-700">Duration:</span>{' '}
                  <span className="text-gray-900">{routeInfo.duration.toFixed(2)} minutes</span>
                </p>
            </div>
          </div>
          <div className="w-2/3 p-4">
            <MapContainer
              center={[routeInfo.coordinates[0][1], routeInfo.coordinates[0][0]]}
              zoom={6}
              style={{ height: '400px', width: '100%' }}
            >
              <ChangeView coords={routeInfo.coordinates} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Polyline positions={routeInfo.coordinates.map(coord => [coord[1], coord[0]] as [number, number])} />
              <Marker position={[routeInfo.coordinates[0][1], routeInfo.coordinates[0][0]]} icon={customIcon} />
              <Marker position={[routeInfo.coordinates[routeInfo.coordinates.length - 1][1], routeInfo.coordinates[routeInfo.coordinates.length - 1][0]]} icon={customIcon} />
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
