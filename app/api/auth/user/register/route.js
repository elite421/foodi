import { NextResponse } from 'next/server';
import { registerUser } from '@/app/lib/auth';

export async function POST(request) {
    try {
        const { phone, otp, name, email } = await request.json();
        if (!phone || !otp || !name || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        if (!/^\d{10}$/.test(phone)) return NextResponse.json({ error: 'Phone number must be exactly 10 digits' }, { status: 400 });

        const result = await registerUser(phone, otp, name, email);
        const response = NextResponse.json({ success: true, user: result.user });
        response.cookies.set('fc_user_session', result.sessionId, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', expires: result.expires, path: '/'
        });
        return response;
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
