// app/api/fetch-product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ProductData {
  title: string;
  price: string;
  listedBy: string;
  address: string;
  imgSrc? : string;
}

export async function POST(request: NextRequest) {
  try {
    const { url }: { url: string } = await request.json();
    console.log('Received URL:', url);

    const response = await axios.get<string>(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'text/html',
      },
    });
    console.log('Response status:', response.status);

    const $ = cheerio.load(response.data);
    console.log('Cheerio loaded successfully');

    // Adjust selectors as needed based on actual HTML structure
    const title = $('h1#viewad-title').text().trim();
    const price = $('#viewad-price').text().trim();
    const listedBy = $('#viewad-contact .userprofile-vip').text().trim();
    const address = $('#viewad-locality').text().trim();
    const imgSrc = $('#viewad-product img').attr('src');

    console.log('Extracted data:', { title, price, listedBy, address, imgSrc});

    const productData: ProductData = { title, price, listedBy, address, imgSrc};
    return NextResponse.json(productData, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching product data:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    return NextResponse.json({ error: 'Error fetching product data' }, { status: 500 });
  }
}
