import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json({ error: 'Input is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://api.openrouteservice.org/geocode/autocomplete`, {
      params: {
        api_key: process.env.ORS_API_KEY,
        text: input,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}