import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import { getElite, updateElite, addEliteItem, deleteEliteItem } from '@/app/lib/dataManager';

export async function GET() {
    try { return NextResponse.json(await getElite()); }
    catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        if (body.action === 'addItem') {
            const item = { id: 'elite-' + Date.now(), label: body.item.label || '', image: body.item.image || '', sortOrder: body.item.sortOrder || 0 };
            await addEliteItem(item);
        } else if (body.action === 'deleteItem') {
            await deleteEliteItem(body.itemId);
        } else {
            // Map snake_case from admin form to camelCase for Prisma
            const data = {};
            if (body.title !== undefined) data.title = body.title;
            if (body.tagline !== undefined) data.tagline = body.tagline;
            if (body.free_delivery !== undefined) data.freeDelivery = body.free_delivery;
            if (body.free_dishes !== undefined) data.freeDishes = body.free_dishes;
            await updateElite(data);
        }
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
