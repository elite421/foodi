import { NextResponse } from 'next/server';
import { loginUser } from '@/app/lib/auth';

export async function POST(request) {
    try {
        const { phone, otp } = await request.json();
        if (!phone || !otp) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        if (!/^\d{10}$/.test(phone)) return NextResponse.json({ error: 'Phone number must be exactly 10 digits' }, { status: 400 });
        const result = await loginUser(phone, otp);
        if (!result) return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });

        const response = NextResponse.json({ success: true, user: result.user });
        response.cookies.set('fc_user_session', result.sessionId, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', expires: result.expires, path: '/'
        });
        return response;
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
