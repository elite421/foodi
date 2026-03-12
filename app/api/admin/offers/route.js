import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import { getOffers, addOffer, updateOffer, deleteOffer } from '@/app/lib/dataManager';

async function checkAdmin() { const a = await verifySession(); if (!a) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return null; }

export async function GET() {
    try { return NextResponse.json(await getOffers()); }
    catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function POST(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const b = await request.json();
        const data = { id: 'offer-' + Date.now(), title: b.title || '', subtitle: b.subtitle || '', restaurant: b.restaurant || '', image: b.image || '', bgColor: b.bgColor || b.bg_color || '#4338ca', active: b.active !== false };
        return NextResponse.json(await addOffer(data), { status: 201 });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function PUT(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const b = await request.json();
        const { id, bg_color, ...rest } = b;
        if (bg_color !== undefined) rest.bgColor = bg_color;
        await updateOffer(id, rest);
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(request) {
    const d = await checkAdmin(); if (d) return d;
    try { const { searchParams } = new URL(request.url); await deleteOffer(searchParams.get('id')); return NextResponse.json({ success: true }); }
    catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
