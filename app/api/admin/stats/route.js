import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export async function GET() {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [menuItems, categories, offers, collections, users, orders, todaysOrders, monthlyRevenue, totalRevenue, pendingOrders] = await Promise.all([
            prisma.menuItem.count(),
            prisma.category.count(),
            prisma.offer.count(),
            prisma.collection.count(),
            prisma.user.count(),
            prisma.order.count(),
            prisma.order.count({ where: { createdAt: { gte: today } } }),
            prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: thisMonth } } }),
            prisma.order.aggregate({ _sum: { total: true } }),
            prisma.order.count({ where: { status: { in: ['PENDING', 'ACCEPTED', 'PREPARING'] } } }),
        ]);

        // Recent orders for dashboard
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, phone: true } } }
        });

        return NextResponse.json({
            menuItems, categories, offers, collections, users, orders,
            todaysOrders,
            monthlyRevenue: monthlyRevenue._sum.total || 0,
            totalRevenue: totalRevenue._sum.total || 0,
            pendingOrders,
            recentOrders: recentOrders.map(o => ({
                id: o.id, status: o.status, total: o.total,
                paymentMethod: o.paymentMethod, paymentStatus: o.paymentStatus,
                userName: o.user?.name, userPhone: o.user?.phone,
                createdAt: o.createdAt
            }))
        });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
