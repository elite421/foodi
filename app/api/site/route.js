import { NextResponse } from 'next/server';
import { getAllSiteData } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getAllSiteData();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
