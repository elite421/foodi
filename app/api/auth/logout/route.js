import { NextResponse } from 'next/server';
import { logout } from '@/app/lib/auth';

export async function POST() {
    try {
        await logout();
        const res = NextResponse.json({ success: true });
        res.cookies.delete('fc_session');
        return res;
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
