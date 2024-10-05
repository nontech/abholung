import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const berlinCenter = {
  lat: 52.52,
  lng: 13.405
};

const berlinBounds = {
  north: 52.6754542,
  south: 52.3382448,
  west: 13.0883450,
  east: 13.7611609,
};

const libraries: ("places")[] = ["places"];

interface Place {
  address: string;
  latLng: google.maps.LatLng | null;
}

const TransportRoute: React.FC = () => {
  const [origin, setOrigin] = useState<Place>({ address: '', latLng: null });
  const [destination, setDestination] = useState<Place>({ address: '', latLng: null });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
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
  }, [origin.latLng, destination.latLng]);

  const autocompleteOptions: google.maps.places.AutocompleteOptions = {
    bounds: berlinBounds,
    strictBounds: true,
    componentRestrictions: { country: 'de' },
    fields: ['address_components', 'geometry', 'name', 'formatted_address'],
    types: ['establishment', 'geocode']
  };

  const onOriginLoad = (autocomplete: google.maps.places.Autocomplete) => {
    originRef.current = autocomplete;
    setupPlaceChangedListener(autocomplete, setOrigin);
  };

  const onDestinationLoad = (autocomplete: google.maps.places.Autocomplete) => {
    destinationRef.current = autocomplete;
    setupPlaceChangedListener(autocomplete, setDestination);
  };

  const setupPlaceChangedListener = (
    autocomplete: google.maps.places.Autocomplete,
    setPlace: React.Dispatch<React.SetStateAction<Place>>
  ) => {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        // Check if the selected place is within Berlin bounds
        if (lat >= berlinBounds.south && lat <= berlinBounds.north &&
            lng >= berlinBounds.west && lng <= berlinBounds.east) {
          setPlace({
            address: place.formatted_address || place.name || '',
            latLng: place.geometry.location,
          });
        } else {
          setError('Please select a location within Berlin.');
          setPlace({ address: '', latLng: null });
        }
      }
    });
  };

  useEffect(() => {
    if (origin.latLng && destination.latLng && mapRef.current) {
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

      // Set center and bounds
      mapRef.current.setCenter(center);
      mapRef.current.fitBounds(bounds);

      // Optionally, limit the zoom level
      const MAX_ZOOM = 15;
      const zoom = mapRef.current.getZoom();
      if (zoom && zoom > MAX_ZOOM) {
        mapRef.current.setZoom(MAX_ZOOM);
      }
    }
  }, [origin.latLng, destination.latLng, fetchDirections]);

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        libraries={libraries}
      >
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Pickup From</label>
            <Autocomplete
              onLoad={onOriginLoad}
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
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Deliver To</label>
            <Autocomplete
              onLoad={onDestinationLoad}
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
          </div>
        </div>

        {loading && <p className="text-gray-600">Calculating route...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {duration && distance && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Route Information</h2>
            <div className="space-y-4">
              <p className="text-xl">
                <span className="text-blue-700">Distance:</span>{' '}
                <span className="text-gray-900">{distance}</span>
              </p>
              <p className="text-xl">
                <span className="text-blue-700">Duration:</span>{' '}
                <span className="text-gray-900">{duration}</span>
              </p>
            </div>
          </div>
        )}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={berlinCenter}
          zoom={11}
          onLoad={onMapLoad}
          options={{
            restriction: {
              latLngBounds: berlinBounds,
              strictBounds: false,
            },
          }}
        >
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                suppressMarkers: false, // Changed to false to show markers
                preserveViewport: true,
                polylineOptions: {
                  strokeColor: "#3366FF",
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default TransportRoute;