import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ORS_API_KEY = process.env.ORS_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!start || !end) {
    return NextResponse.json({ error: 'Start and end coordinates are required' }, { status: 400 });
  }

  if (!ORS_API_KEY) {
    console.error('ORS_API_KEY is not set');
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    const response = await axios.get('https://api.openrouteservice.org/v2/directions/driving-car', {
      params: {
        api_key: ORS_API_KEY,
        start,
        end,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Directions error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
      return NextResponse.json({ error: `Failed to fetch directions: ${error.message}`, details: error.response?.data }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch directions' }, { status: 500 });
  }
}
