import { NextResponse } from 'next/server';
import { verifyOTP } from '@/app/lib/msg91Service';

/**
 * POST /api/sms/verify-otp
 * Verify OTP for a phone number
 * Body: { phone: string, otp: string }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { phone, otp } = body;

        if (!phone || !otp) {
            return NextResponse.json(
                { success: false, message: 'Phone number and OTP are required' },
                { status: 400 }
            );
        }

        // Validate phone number format
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { success: false, message: 'Invalid phone number format. Use format: +919999999999' },
                { status: 400 }
            );
        }

        const result = await verifyOTP(phone, otp);

        if (result.success) {
            return NextResponse.json(result, { status: 200 });
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        console.error('Verify OTP API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
