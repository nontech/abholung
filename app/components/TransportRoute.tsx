import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { MapData, Place } from '@/types/common';

const mapContainerStyle = {
  width: '100%',
  height: '200px'
};

const berlinCenter = {
  lat: 52.52,
  lng: 13.405
};

const germanyBounds = {
  north: 55.0581,
  south: 47.2701,
  west: 5.8663,
  east: 15.0419
};

interface TransportRouteProps {
  origin: Place;
  destination: Place;
  setOrigin: React.Dispatch<React.SetStateAction<Place>>;
  setDestination: React.Dispatch<React.SetStateAction<Place>>;
  onMapDataChange: (mapData: MapData) => void;
  pickupFromError: string;
  deliverToError: string;
  duration: string | null;
  setDuration: (duration: string | null) => void;
}

interface LatLngLiteral {
  lat: number;
  lng: number;
}

const TransportRoute: React.FC<TransportRouteProps> = ({
  origin,
  destination,
  setOrigin,
  setDestination,
  onMapDataChange,
  pickupFromError,
  deliverToError,
  duration,
  setDuration
}) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(berlinCenter);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);

  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  }, []);

  const fetchDirections = useCallback(() => {
    if (!origin.latLng || !destination.latLng) return;

    setLoading(true);
    setError('');
    setDirections(null);
    setDuration(null);
    setDistance(null);

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin.latLng,
        destination: destination.latLng,
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result, status) => {
        setLoading(false);
        if (result !== null && status === 'OK') {
          setDirections(result);
          setDuration(result.routes[0].legs[0].duration?.text || null);
          setDistance(result.routes[0].legs[0].distance?.text || null);
        } else {
          console.error('Directions request failed:', status);
          setError('No route found. Please try different locations or travel mode.');
        }
      }
    );
  }, [origin.latLng, destination.latLng, setDuration]);

  const autocompleteOptions: google.maps.places.AutocompleteOptions = {
    bounds: germanyBounds,
    strictBounds: true,
    componentRestrictions: { country: 'de' },
    fields: ['address_components', 'geometry', 'name', 'formatted_address'],
    types: ['establishment', 'geocode']
  };

  const onOriginLoad = (autocomplete: google.maps.places.Autocomplete) => {
    originRef.current = autocomplete;
  };

  const onDestinationLoad = (autocomplete: google.maps.places.Autocomplete) => {
    destinationRef.current = autocomplete;
  };

  const handlePlaceSelect = (
    autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>,
    setPlace: React.Dispatch<React.SetStateAction<Place>>
  ) => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      setPlace({
        address: place.formatted_address || place.name || '',
        latLng: place.geometry.location,
      });
    }
  };

  const onOriginPlaceChanged = () => {
    handlePlaceSelect(originRef, setOrigin);
  };

  const onDestinationPlaceChanged = () => {
    handlePlaceSelect(destinationRef, setDestination);
  };

  useEffect(() => {
    if (origin.latLng && destination.latLng) {
      setShowMap(true);
      fetchDirections();

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(origin.latLng);
      bounds.extend(destination.latLng);

      // Calculate the center point
      const center = bounds.getCenter();

      // Adjust bounds with padding
      const PADDING = 0.2; // Adjust this value to increase or decrease padding
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const latPadding = (ne.lat() - sw.lat()) * PADDING;
      const lngPadding = (ne.lng() - sw.lng()) * PADDING;
      bounds.extend(new google.maps.LatLng(ne.lat() + latPadding, ne.lng() + lngPadding));
      bounds.extend(new google.maps.LatLng(sw.lat() - latPadding, sw.lng() - lngPadding));

      setMapCenter({ lat: center.lat(), lng: center.lng() });
      setMapBounds(bounds);

      // update mapData
      onMapDataChange({ from: origin.address, to: destination.address });
    } else {
      setShowMap(false);
    }
  }, [
    origin.latLng,
    destination.latLng,
    origin.address,
    destination.address,
    fetchDirections,
    onMapDataChange,
  ]);

  useEffect(() => {
    if (isMapLoaded && mapRef.current && mapBounds) {
      mapRef.current.setCenter(mapCenter);
      mapRef.current.fitBounds(mapBounds);

      const MAX_ZOOM = 15;
      const zoom = mapRef.current.getZoom();
      if (zoom && zoom > MAX_ZOOM) {
        mapRef.current.setZoom(MAX_ZOOM);
      }
    }
  }, [isMapLoaded, mapCenter, mapBounds]);

  const calculateTimeSaved = (duration: string): string => {
    const parts = duration.split(' ');
    let hours = 0;
    let minutes = 0;

    for (let i = 0; i < parts.length; i += 2) {
      const value = parseInt(parts[i]);
      const unit = parts[i + 1];

      if (unit.startsWith('hour')) {
        hours = value;
      } else if (unit.startsWith('min')) {
        minutes = value;
      }
    }

    const totalMinutes = hours * 60 + minutes;
    const savedMinutes = totalMinutes * 2;
    const savedHours = Math.floor(savedMinutes / 60);
    const savedMinutesRemainder = savedMinutes % 60;

    if (savedHours > 0) {
      return `${savedHours} hour${savedHours !== 1 ? 's' : ''} ${savedMinutesRemainder} min`;
    } else {
      return `${savedMinutes} min`;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Pickup From</label>
          <Autocomplete
            onLoad={onOriginLoad}
            onPlaceChanged={onOriginPlaceChanged}
            options={autocompleteOptions}
          >
            <input
              type="text"
              placeholder="From"
              value={origin.address}
              onChange={(e) => setOrigin({ ...origin, address: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Autocomplete>
          {pickupFromError && <p className="text-red-500 text-sm mt-1">{pickupFromError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Deliver To</label>
          <Autocomplete
            onLoad={onDestinationLoad}
            onPlaceChanged={onDestinationPlaceChanged}
            options={autocompleteOptions}
          >
            <input
              type="text"
              placeholder="To"
              value={destination.address}
              onChange={(e) => setDestination({ ...destination, address: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Autocomplete>
          {deliverToError && <p className="text-red-500 text-sm mt-1">{deliverToError}</p>}
        </div>
      </div>

      {loading && <p className="text-gray-600">Calculating route...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showMap && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={11}
          onLoad={onMapLoad}
          options={{
            restriction: {
              latLngBounds: germanyBounds,
              strictBounds: false,
            },
          }}
        >
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                suppressMarkers: false,
                preserveViewport: true,
                polylineOptions: {
                  strokeColor: '#3366FF',
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>
      )}

      {showMap && duration && distance && (
        <div className="mb-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 text-center p-2">
              <p className="text-sm text-gray-600 mb-1 font-bold mb-2">Distance</p>
              <div className="bg-white rounded-full py-2 px-4 shadow-md">
                <span className="text-xl font-bold text-blue-600">{distance || '—'}</span>
              </div>
            </div>
            <div className="flex-1 text-center p-2">
              <p className="text-sm text-gray-600 mb-1 font-bold mb-2">Duration</p>
              <div className="bg-white rounded-full py-2 px-4 shadow-md">
                <span className="text-xl font-bold text-green-600">{duration || '—'}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 shadow-lg text-white overflow-hidden relative">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Time Saved</h3>
                <p className="text-3xl font-bold">
                  {calculateTimeSaved(duration)} <span className="text-sm text-gray-400">( + 10 min )</span>
                </p>
              </div>
              <div className="text-right">
                <svg
                  className="w-16 h-16 opacity-20 absolute top-0 right-0 transform translate-x-4 -translate-y-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm opacity-80">
              You are saving valuable time, including time spent talking to individual.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportRoute;
