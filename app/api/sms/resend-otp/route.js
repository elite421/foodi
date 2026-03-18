import { NextResponse } from 'next/server';
import { resendOTP } from '../../lib/msg91Service';

/**
 * POST /api/sms/resend-otp
 * Resend OTP to a phone number
 * Body: { phone: string, type?: 'text' | 'voice' }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { phone, type = 'text' } = body;

        if (!phone) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
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

        // Validate type
        if (!['text', 'voice'].includes(type)) {
            return NextResponse.json(
                { success: false, message: 'Invalid type. Use "text" or "voice"' },
                { status: 400 }
            );
        }

        const result = await resendOTP(phone, type);

        if (result.success) {
            return NextResponse.json(result, { status: 200 });
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        console.error('Resend OTP API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
