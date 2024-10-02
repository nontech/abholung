import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: 'Order ID is required' },
      { status: 400 }
    );
  }

  try {
    const kvUrl = `${process.env.KV_REST_API_URL}/get/order:${id}`;

    const response = await fetch(kvUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    if (response.status === 404) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`KV API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.result) {
      return NextResponse.json(
        { message: 'Order not found in KV store' },
        { status: 404 }
      );
    }

    // Parse the 'result' string into an object
    const parsedResult = JSON.parse(data.result);

    if (!parsedResult.value) {
      return NextResponse.json(
        { message: 'Order data is missing' },
        { status: 500 }
      );
    }

    const order = parsedResult.value;

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
