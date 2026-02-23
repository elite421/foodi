import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import { getCollections, addCollection, updateCollection, deleteCollection } from '@/app/lib/dataManager';

async function checkAdmin() {
    const a = await verifySession();
    if (!a) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return null;
}

export async function GET() {
    try {
        return NextResponse.json(await getCollections());
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const d = await checkAdmin();
    if (d) return d;
    try {
        const b = await request.json();
        const data = {
            id: 'col-' + Date.now(),
            title: b.title || '',
            image: b.image || '',
            link: `/collection/col-${Date.now()}`,
            description: b.description || '',
            menuItemIds: b.menuItemIds || '[]',
        };
        return NextResponse.json(await addCollection(data), { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(request) {
    const d = await checkAdmin();
    if (d) return d;
    try {
        const b = await request.json();
        const { id, ...rest } = b;
        const updateData = {
            title: rest.title,
            image: rest.image,
            link: `/collection/${id}`,
            description: rest.description || '',
            menuItemIds: rest.menuItemIds || '[]',
        };
        await updateCollection(id, updateData);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const d = await checkAdmin();
    if (d) return d;
    try {
        const { searchParams } = new URL(request.url);
        await deleteCollection(searchParams.get('id'));
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
