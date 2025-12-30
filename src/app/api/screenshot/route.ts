import { NextRequest, NextResponse } from 'next/server';

// Cache screenshots for 30 days (in seconds)
const CACHE_DURATION = 30 * 24 * 60 * 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
  }

  try {
    // Fetch screenshot from Microlink
    const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

    const response = await fetch(microlinkUrl, {
      next: { revalidate: CACHE_DURATION }, // ISR caching
    });

    if (!response.ok) {
      throw new Error(`Microlink returned ${response.status}`);
    }

    // Microlink with embed=screenshot.url redirects to the actual image
    // So we need to follow the redirect and get the image
    const imageUrl = response.url;

    // Fetch the actual image
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(`Image fetch failed: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';

    // Return the image with long cache headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
        'CDN-Cache-Control': `public, max-age=${CACHE_DURATION}`,
        'Vercel-CDN-Cache-Control': `public, max-age=${CACHE_DURATION}`,
      },
    });
  } catch (error) {
    console.error('Screenshot fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch screenshot' },
      { status: 500 }
    );
  }
}

// Enable edge runtime for better caching
export const runtime = 'edge';
