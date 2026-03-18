import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAdminSession } from '@/app/lib/auth';

export async function POST(request) {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { section, data } = await request.json();

        if (section === 'api') {
            // Update API settings
            await prisma.settings.update({
                where: { id: 1 },
                data: {
                    razorpayKeyId: data.razorpayKeyId,
                    razorpayKeySecret: data.razorpayKeySecret,
                    razorpayWebhookSecret: data.razorpayWebhookSecret,
                    // Store MSG91 settings if the fields exist, otherwise they'll be ignored
                    ...(data.msg91AuthKey && { msg91AuthKey: data.msg91AuthKey }),
                    ...(data.msg91OtpTemplateId && { msg91OtpTemplateId: data.msg91OtpTemplateId }),
                    ...(data.msg91SenderId && { msg91SenderId: data.msg91SenderId }),
                }
            });
        }

        return NextResponse.json({ success: true, message: 'Settings updated' });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
