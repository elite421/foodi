import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/app/lib/auth';

export async function POST() {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Revalidate all major paths
        const paths = [
            '/',
            '/menu',
            '/offers',
            '/account',
            '/admin',
            '/admin/orders',
            '/admin/menu',
            '/admin/users',
        ];

        const results = [];
        for (const path of paths) {
            try {
                revalidatePath(path);
                results.push({ path, status: 'success' });
            } catch (error) {
                results.push({ path, status: 'error', error: error.message });
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Cache cleared and pages revalidated',
            results 
        });
    } catch (error) {
        console.error('Clear cache error:', error);
        return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
    }
}
