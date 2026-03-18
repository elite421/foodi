import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAdminSession } from '@/app/lib/auth';

export async function POST() {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Cleanup expired sessions
        const expiredSessions = await prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });

        // Cleanup old OTPs (older than 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const oldOtps = await prisma.otp.deleteMany({
            where: {
                createdAt: {
                    lt: oneHourAgo
                }
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Cleanup completed',
            deletedSessions: expiredSessions.count,
            deletedOtps: oldOtps.count
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
    }
}
