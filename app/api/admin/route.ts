import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { credentials } = await request.json();
  console.log('Received credentials:', credentials);
  console.log('Expected credentials:', process.env.ADMIN_CREDENTIALS);

  if (credentials === process.env.ADMIN_CREDENTIALS) {
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
