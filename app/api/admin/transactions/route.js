import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export async function GET(req) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const status = searchParams.get('status') || '';
        const paymentMethod = searchParams.get('paymentMethod') || '';
        const search = searchParams.get('search') || '';
        const limit = 20;

        const where = {};
        if (status) where.paymentStatus = status;
        if (paymentMethod) where.paymentMethod = paymentMethod;
        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { paymentId: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { phone: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const [orders, total, stats] = await Promise.all([
            prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: { select: { name: true, phone: true, email: true } },
                }
            }),
            prisma.order.count({ where }),
            prisma.order.aggregate({
                _sum: { total: true, tax: true, deliveryFee: true, discount: true },
                _count: true,
                where: { paymentStatus: 'COMPLETED' }
            })
        ]);

        // Get overall stats
        const [totalOrders, codOrders, onlineOrders, pendingPayments] = await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { paymentMethod: 'COD' } }),
            prisma.order.count({ where: { paymentMethod: 'ONLINE' } }),
            prisma.order.count({ where: { paymentStatus: 'PENDING', paymentMethod: 'ONLINE' } }),
        ]);

        const transactions = orders.map(o => ({
            id: o.id,
            userId: o.userId,
            userName: o.user?.name || 'Unknown',
            userPhone: o.user?.phone || '',
            userEmail: o.user?.email || '',
            subtotal: o.subtotal,
            tax: o.tax,
            deliveryFee: o.deliveryFee,
            discount: o.discount,
            total: o.total,
            paymentMethod: o.paymentMethod,
            paymentStatus: o.paymentStatus,
            paymentId: o.paymentId || '-',
            orderStatus: o.status,
            couponCode: o.couponCode || '-',
            createdAt: o.createdAt,
        }));

        return NextResponse.json({
            transactions,
            total,
            pages: Math.ceil(total / limit),
            summary: {
                totalRevenue: stats._sum.total || 0,
                totalTax: stats._sum.tax || 0,
                totalDeliveryFees: stats._sum.deliveryFee || 0,
                totalDiscounts: stats._sum.discount || 0,
                completedOrders: stats._count || 0,
                totalOrders,
                codOrders,
                onlineOrders,
                pendingPayments,
            }
        });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
