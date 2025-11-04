
import { NextResponse } from 'next/server'
import data from '@/data/herbs.json'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').toLowerCase()
  const items = (data as any[]).filter(h => !q || h.commonName.toLowerCase().includes(q) || h.uses.some((u:string)=>u.toLowerCase().includes(q)))
  return NextResponse.json({ items })
}
