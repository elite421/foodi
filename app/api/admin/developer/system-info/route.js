import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAdminSession } from '@/app/lib/auth';

export async function GET() {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Gather system information
        const info = {
            nodeVersion: process.version,
            nextVersion: process.env.NEXT_VERSION || '14.x',
            environment: process.env.NODE_ENV || 'development',
            platform: process.platform,
            dbProvider: 'postgresql',
            dbConnected: false,
            orderCount: 0,
            userCount: 0,
            menuItemCount: 0,
            serverTime: new Date().toISOString()
        };

        // Check database connection and get counts
        try {
            const [orderCount, userCount, menuItemCount] = await Promise.all([
                prisma.order.count(),
                prisma.user.count(),
                prisma.menuItem.count()
            ]);
            
            info.dbConnected = true;
            info.orderCount = orderCount;
            info.userCount = userCount;
            info.menuItemCount = menuItemCount;
        } catch (dbError) {
            console.error('Database connection error:', dbError);
        }

        return NextResponse.json({ success: true, info });
    } catch (error) {
        console.error('System info error:', error);
        return NextResponse.json({ error: 'Failed to get system info' }, { status: 500 });
    }
}
