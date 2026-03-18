import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/app/lib/dataManager';

async function checkAdmin() { const a = await verifySession(); if (!a) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return null; }

export async function GET() {
    try { return NextResponse.json(await getCategories()); }
    catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function POST(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const b = await request.json();
        const data = { id: 'cat-' + Date.now(), name: b.name || '', icon: b.icon || '', image: b.image || '', sortOrder: b.sortOrder || b.sort_order || 0 };
        return NextResponse.json(await addCategory(data), { status: 201 });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function PUT(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const b = await request.json();
        const { id, sort_order, ...rest } = b;
        if (sort_order !== undefined) rest.sortOrder = sort_order;
        await updateCategory(id, rest);
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(request) {
    const d = await checkAdmin(); if (d) return d;
    try { const { searchParams } = new URL(request.url); await deleteCategory(searchParams.get('id')); return NextResponse.json({ success: true }); }
    catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
