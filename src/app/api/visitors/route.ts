import { NextResponse } from 'next/server';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

async function redis(command: string[]) {
  const res = await fetch(`${REDIS_URL}/${command.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: 'no-store',
  });
  return res.json();
}

export async function POST() {
  // Increment visitor count and return new value
  const { result } = await redis(['INCR', 'portfolio:visitors']);
  return NextResponse.json({ count: result });
}

export async function GET() {
  // Just read the current count
  const { result } = await redis(['GET', 'portfolio:visitors']);
  return NextResponse.json({ count: result ?? 0 });
}
