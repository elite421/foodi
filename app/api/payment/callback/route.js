import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/app/lib/prisma';

/**
 * POST /api/payment/callback
 * Razorpay Webhook Handler for payment status updates
 * This endpoint receives server-to-server callbacks from Razorpay
 * 
 * Webhook URL to configure in Razorpay Dashboard:
 * https://your-domain.com/api/payment/callback
 * 
 * Required events to subscribe:
 * - payment.captured
 * - payment.failed
 * - order.paid
 */
export async function POST(request) {
    try {
        // Get the raw body as text for signature verification
        const body = await request.text();
        const payload = JSON.parse(body);

        // Get Razorpay signature from headers
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            console.error('❌ Razorpay webhook: Missing signature');
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        // Fetch Razorpay secret from settings
        const settings = await prisma.settings.findFirst({ where: { id: 1 } });
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || settings?.razorpayWebhookSecret;

        if (!webhookSecret) {
            console.error('❌ Razorpay webhook: Webhook secret not configured');
            return NextResponse.json(
                { error: 'Webhook secret not configured' },
                { status: 500 }
            );
        }

        // Verify Razorpay signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('❌ Razorpay webhook: Invalid signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        console.log('✅ Razorpay webhook signature verified');
        console.log('📦 Event:', payload.event);

        // Handle different event types
        const { event, payload: eventPayload } = payload;

        switch (event) {
            case 'payment.captured':
            case 'order.paid': {
                const payment = eventPayload?.payment?.entity;
                const order = eventPayload?.order?.entity;

                if (!payment) {
                    console.error('❌ Razorpay webhook: Missing payment data');
                    return NextResponse.json(
                        { error: 'Missing payment data' },
                        { status: 400 }
                    );
                }

                // Find order by Razorpay order ID (stored in notes or receipt)
                const razorpayOrderId = order?.id || payment.order_id;
                const internalOrderId = payment.notes?.internal_order_id || 
                                       payment.receipt ||
                                       razorpayOrderId;

                // Update order payment status
                const updatedOrder = await prisma.order.updateMany({
                    where: {
                        OR: [
                            { id: internalOrderId },
                            { paymentId: payment.id },
                            { razorpayOrderId: razorpayOrderId }
                        ]
                    },
                    data: {
                        paymentStatus: 'COMPLETED',
                        paymentId: payment.id,
                        status: 'ACCEPTED', // Auto-accept paid orders
                        paidAt: new Date(payment.created_at * 1000)
                    }
                });

                if (updatedOrder.count > 0) {
                    console.log(`✅ Order updated: ${internalOrderId}, Payment: ${payment.id}`);
                    
                    // Optional: Send confirmation email/SMS
                    await sendPaymentConfirmation(internalOrderId, payment);
                } else {
                    console.warn(`⚠️ Order not found: ${internalOrderId}`);
                }

                break;
            }

            case 'payment.failed': {
                const payment = eventPayload?.payment?.entity;
                
                if (!payment) {
                    console.error('❌ Razorpay webhook: Missing payment data');
                    return NextResponse.json(
                        { error: 'Missing payment data' },
                        { status: 400 }
                    );
                }

                const internalOrderId = payment.notes?.internal_order_id || payment.receipt;
                const razorpayOrderId = payment.order_id;

                // Update order payment status to failed
                await prisma.order.updateMany({
                    where: {
                        OR: [
                            { id: internalOrderId },
                            { paymentId: payment.id },
                            { razorpayOrderId: razorpayOrderId }
                        ]
                    },
                    data: {
                        paymentStatus: 'FAILED',
                        paymentId: payment.id,
                        paymentError: payment.error_description || 'Payment failed'
                    }
                });

                console.log(`❌ Payment failed for order: ${internalOrderId}`);
                break;
            }

            case 'refund.processed': {
                const refund = eventPayload?.refund?.entity;
                
                if (refund) {
                    const paymentId = refund.payment_id;
                    
                    // Update order with refund info
                    await prisma.order.updateMany({
                        where: { paymentId: paymentId },
                        data: {
                            refundId: refund.id,
                            refundStatus: 'PROCESSED',
                            refundAmount: refund.amount / 100 // Convert from paise
                        }
                    });

                    console.log(`💰 Refund processed: ${refund.id}`);
                }
                break;
            }

            default:
                console.log(`ℹ️ Unhandled Razorpay event: ${event}`);
        }

        // Always return 200 to acknowledge receipt
        return NextResponse.json(
            { success: true, message: 'Webhook processed' },
            { status: 200 }
        );

    } catch (error) {
        console.error('❌ Razorpay webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * Send payment confirmation notification
 * @param {string} orderId - Internal order ID
 * @param {object} payment - Razorpay payment entity
 */
async function sendPaymentConfirmation(orderId, payment) {
    try {
        // Fetch order details
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) return;

        // TODO: Implement email/SMS notification
        // Example: await sendEmail(order.user.email, 'Payment Confirmed', template);
        // Example: await sendSMS(order.user.phone, `Your order #${orderId} payment of ₹${payment.amount/100} is confirmed.`);

        console.log(`📧 Payment confirmation queued for order: ${orderId}`);
    } catch (error) {
        console.error('❌ Error sending confirmation:', error);
    }
}

/**
 * GET /api/payment/callback
 * For testing webhook endpoint availability
 */
export async function GET(request) {
    return NextResponse.json(
        { 
            success: true, 
            message: 'Razorpay webhook endpoint is active',
            webhookUrl: '/api/payment/callback',
            supportedEvents: [
                'payment.captured',
                'payment.failed',
                'order.paid',
                'refund.processed'
            ]
        },
        { status: 200 }
    );
}
