import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/app/lib/auth';

export async function GET() {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Return recent server logs (in production, you'd read from a log file)
        const logs = [
            { timestamp: new Date().toISOString(), level: 'INFO', message: 'Server started' },
            { timestamp: new Date(Date.now() - 60000).toISOString(), level: 'INFO', message: 'Database connected' },
            { timestamp: new Date(Date.now() - 120000).toISOString(), level: 'WARN', message: 'Rate limit approaching' },
        ];

        return NextResponse.json({ success: true, logs });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to get logs' }, { status: 500 });
    }
}
