import { verifyUserSession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const user = await verifyUserSession();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = parseInt(searchParams.get('offset')) || 0;

    try {
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
                select: {
                    id: true,
                    total: true,
                    status: true,
                    createdAt: true,
                    paymentMethod: true,
                    items: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            quantity: true
                        }
                    }
                }
            }),
            prisma.order.count({
                where: { userId: user.id }
            })
        ]);

        return NextResponse.json({ orders, total, limit, offset });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
