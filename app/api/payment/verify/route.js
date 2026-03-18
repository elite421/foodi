import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/app/lib/prisma';
import { verifyUserSession } from '@/app/lib/auth';

export async function POST(req) {
    try {
        const user = await verifyUserSession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();
        const settings = await prisma.settings.findFirst({ where: { id: 1 } });

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', settings.razorpayKeySecret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            await prisma.order.update({
                where: { id: orderId },
                data: { paymentStatus: 'COMPLETED', paymentId: razorpay_payment_id }
            });
            return NextResponse.json({ success: true, message: 'Payment verified successfully' });
        } else {
            await prisma.order.update({
                where: { id: orderId },
                data: { paymentStatus: 'FAILED' }
            });
            return NextResponse.json({ success: false, error: 'Payment signature mismatch' }, { status: 400 });
        }
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
