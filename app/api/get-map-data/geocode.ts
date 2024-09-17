import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

interface GeocodeResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number];
    };
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const response = await axios.get<GeocodeResponse>('https://api.openrouteservice.org/geocode/search', {
      params: {
        api_key: process.env.OPENROUTE_API_KEY,
        text: address,
      },
    });

    if (response.data.features.length === 0) {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }

    const coordinates = response.data.features[0].geometry.coordinates;
    return NextResponse.json({ coordinates });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error geocoding address:', axiosError.message);
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 500 });
  }
}
