import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifySession } from '@/app/lib/auth';

export async function GET() {
    try {
        const items = await prisma.menuItem.findMany({ include: { category: true, brand: true }, orderBy: { sortOrder: 'asc' } });
        return NextResponse.json(items);
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req) {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const item = await prisma.menuItem.create({ data });
        return NextResponse.json(item);
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(req) {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, category, brand, ...rest } = await req.json();
        const item = await prisma.menuItem.update({ where: { id }, data: rest });
        return NextResponse.json(item);
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req) {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // ID is a String (UUID)
        await prisma.menuItem.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
