import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyUserSession } from '@/app/lib/auth';

export async function GET() {
    try {
        const user = await verifyUserSession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const addresses = await prisma.address.findMany({ where: { userId: user.id } });
        return NextResponse.json({ success: true, addresses });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req) {
    try {
        const user = await verifyUserSession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const address = await prisma.address.create({
            data: { ...data, userId: user.id }
        });
        return NextResponse.json({ success: true, address });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
