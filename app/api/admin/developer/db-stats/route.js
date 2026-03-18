import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAdminSession } from '@/app/lib/auth';

export async function GET() {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get table counts
        const stats = {
            orders: await prisma.order.count(),
            users: await prisma.user.count(),
            menuItems: await prisma.menuItem.count(),
            categories: await prisma.category.count(),
            brands: await prisma.brand.count(),
            coupons: await prisma.coupon.count(),
            addresses: await prisma.address.count(),
            parties: await prisma.party.count(),
            sessions: await prisma.session.count()
        };

        return NextResponse.json({ success: true, stats });
    } catch (error) {
        console.error('DB stats error:', error);
        return NextResponse.json({ error: 'Failed to get database stats' }, { status: 500 });
    }
}
