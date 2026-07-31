import { NextResponse } from 'next/server';

export async function GET() {
  const err = (globalThis as any).lastError || { message: "No error captured yet" };
  return NextResponse.json(err);
}
