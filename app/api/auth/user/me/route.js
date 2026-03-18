import { NextResponse } from 'next/server';
import { verifyUserSession } from '@/app/lib/auth';

export async function GET() {
    try {
        const user = await verifyUserSession();
        if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });
        return NextResponse.json({ authenticated: true, user });
    } catch (e) { return NextResponse.json({ authenticated: false, error: e.message }, { status: 500 }); }
}
