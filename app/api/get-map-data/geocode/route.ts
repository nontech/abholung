// app/api/get-map-data/geocode/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ORS_API_KEY = process.env.ORS_API_KEY;

export async function GET(request: NextRequest) {
  console.log('API Key:', ORS_API_KEY); // Remove this in production

  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  if (!ORS_API_KEY) {
    console.error('ORS_API_KEY is not set');
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    console.log('Geocoding address:', address);
    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: {
        api_key: ORS_API_KEY,
        text: address,
      },
    });
    console.log('Geocoding response:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Geocoding error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
      return NextResponse.json({ error: `Failed to geocode address: ${error.message}`, details: error.response?.data }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 500 });
  }
}
