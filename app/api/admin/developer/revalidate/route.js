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
            '/brand/[slug]',
            '/account',
            '/account/orders',
        ];

        const results = [];
        for (const path of paths) {
            try {
                revalidatePath(path, 'page');
                results.push({ path, status: 'revalidated' });
            } catch (error) {
                results.push({ path, status: 'error', error: error.message });
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Pages revalidated successfully',
            results 
        });
    } catch (error) {
        console.error('Revalidate error:', error);
        return NextResponse.json({ error: 'Failed to revalidate pages' }, { status: 500 });
    }
}
