import { NextResponse } from 'next/server';
import { sendOtp } from '@/app/lib/auth';

export async function POST(request) {
    try {
        const { phone } = await request.json();
        if (!phone) return NextResponse.json({ error: 'Missing phone number' }, { status: 400 });
        if (!/^\d{10}$/.test(phone)) return NextResponse.json({ error: 'Phone number must be exactly 10 digits' }, { status: 400 });

        const result = await sendOtp(phone);
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
