import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export async function GET(req, { params }) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                addresses: true,
                orders: {
                    orderBy: { createdAt: 'desc' },
                    include: { items: { include: { menuItem: true } }, address: true }
                }
            }
        });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ user });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
