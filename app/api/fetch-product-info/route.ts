import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ProductData } from '@/types/common';

export async function POST(request: NextRequest) {
  try {
    const { newUrl }: { newUrl: string } = await request.json();

    const response = await axios.get<string>(newUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'text/html',
      },
    });

    const $ = cheerio.load(response.data);

    // Adjust selectors as needed based on actual HTML structure
    const title = $('h1#viewad-title').text().trim();
    const price = $('#viewad-price').text().trim();
    const listed_by = $('#viewad-contact .userprofile-vip').text().trim();
    const address = $('#viewad-locality').text().trim();
    const pic_url = $('#viewad-product img').attr('src');

    const productData: ProductData = { newUrl, title, price, listed_by, address, pic_url};
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
