import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import { updateOrderStatus, getOrders } from '@/app/lib/dataManager';

export async function GET(req) {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const orders = await getOrders();
        return NextResponse.json({ success: true, orders });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status } = await req.json();
        const order = await updateOrderStatus(id, status);
        return NextResponse.json({ success: true, order });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
