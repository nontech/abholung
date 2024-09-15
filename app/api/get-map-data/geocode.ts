// app/api/get-map-data/geocode.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const ORS_API_KEY = process.env.ORS_API_KEY

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  try {
    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: {
        api_key: ORS_API_KEY,
        text: address,
        size: 1,
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 500 })
  }
}
