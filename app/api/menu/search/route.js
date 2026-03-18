import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');

        if (!q || q.trim().length === 0) {
            return NextResponse.json({ items: [] });
        }

        const items = await prisma.menuItem.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } }
                ]
            },
            take: 10,
            include: { category: true }
        });

        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
