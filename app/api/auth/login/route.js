import { NextResponse } from 'next/server';
import { login } from '@/app/lib/auth';

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
        const result = await login(username, password);
        if (!result) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        const res = NextResponse.json({ success: true, admin: result.admin });
        res.cookies.set('fc_session', result.sessionId, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', path: '/', expires: result.expires
        });
        return res;
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
