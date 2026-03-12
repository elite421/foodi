import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export async function GET(req) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 20;

        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { id: { contains: search, mode: 'insensitive' } },
            ]
        } : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: { select: { orders: true, addresses: true } },
                    orders: {
                        select: { total: true, status: true, paymentStatus: true },
                    }
                }
            }),
            prisma.user.count({ where })
        ]);

        const formatted = users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt,
            orderCount: u._count.orders,
            addressCount: u._count.addresses,
            totalSpent: u.orders.filter(o => o.paymentStatus === 'COMPLETED' || o.paymentMethod === 'COD').reduce((sum, o) => sum + o.total, 0),
        }));

        return NextResponse.json({ users: formatted, total, pages: Math.ceil(total / limit) });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
