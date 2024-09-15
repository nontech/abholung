// app/api/get-map-data/route/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  const ORS_API_KEY = process.env.ORS_API_KEY
  const body = await request.json()
  const { from, to } = body

  if (!from || !to) {
    return NextResponse.json({ error: 'From and To coordinates are required' }, { status: 400 })
  }

  try {
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        coordinates: [from, to],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: ORS_API_KEY,
        },
      }
    )
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Routing error:', error)
    return NextResponse.json({ error: 'Failed to get route information' }, { status: 500 })
  }
}
