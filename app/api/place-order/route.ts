import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { order } = body;

  if (!order || !order.id) {
    return NextResponse.json(
      { message: 'Order data is required and must include an id' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.KV_REST_API_URL}/set/order:${order.id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: order }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to store order data: ${response.statusText}`);
    }

    return NextResponse.json(
      { message: 'Order data stored successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error storing order data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
