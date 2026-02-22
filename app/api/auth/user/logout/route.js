import { NextResponse } from 'next/server';
import { logout } from '@/app/lib/auth';

export async function POST() {
    try {
        await logout(true);
        const response = NextResponse.json({ success: true });
        response.cookies.delete('fc_user_session');
        return response;
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
