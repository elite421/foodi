import { NextResponse } from 'next/server';
import { sendOTP, verifyOTP, resendOTP, sendTemplatedSMS } from '@/app/lib/msg91Service';

/**
 * POST /api/sms/send-otp
 * Send OTP to a phone number with custom template
 * Body: { phone: string, otp?: string, name?: string }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { phone, otp, name } = body;

        if (!phone) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        // Validate phone number format (with country code)
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { success: false, message: 'Invalid phone number format. Use format: +919999999999' },
                { status: 400 }
            );
        }

        let result;
        
        // If template variables are provided, use templated SMS
        if (name && process.env.MSG91_USE_FLOW === 'true') {
            result = await sendTemplatedSMS(phone, name, otp);
        } else {
            // Use standard OTP API
            result = await sendOTP(phone, otp);
        }

        if (result.success) {
            return NextResponse.json(result, { status: 200 });
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        console.error('Send OTP API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
