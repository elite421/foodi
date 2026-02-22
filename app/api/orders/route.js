import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyUserSession } from '@/app/lib/auth';
import Razorpay from 'razorpay';

// Utility to generate 7 alphanumeric chars
const generateOrderId = () => {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
};

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export async function POST(req) {
    try {
        const user = await verifyUserSession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { cart, addressId, couponCode, paymentMethod = 'COD' } = await req.json();
        if (!cart || cart.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        if (!addressId) return NextResponse.json({ error: 'No address selected' }, { status: 400 });

        const settings = await prisma.settings.findFirst({ where: { id: 1 } });
        const address = await prisma.address.findUnique({ where: { id: addressId, userId: user.id } });
        if (!address) return NextResponse.json({ error: 'Invalid address' }, { status: 400 });

        if (address.lat && address.lng && settings.restaurantLat && settings.restaurantLng) {
            const distance = getDistance(settings.restaurantLat, settings.restaurantLng, address.lat, address.lng);
            if (distance > settings.deliveryRadius) {
                return NextResponse.json({ error: `Address is outside our delivery radius of ${settings.deliveryRadius}km.` }, { status: 400 });
            }
        }

        // Calculate totals server-side
        let subtotal = 0;
        const itemsToCreate = [];

        for (const item of cart) {
            const dbItem = await prisma.menuItem.findUnique({ where: { id: item.id } });
            if (!dbItem || !dbItem.isAvailable) throw new Error(`${item.name} is not available`);
            subtotal += dbItem.price * item.qty;
            itemsToCreate.push({ menuItemId: dbItem.id, quantity: item.qty, priceAtTime: dbItem.price });
        }

        let discount = 0;
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
            if (coupon && coupon.isActive && subtotal >= coupon.minOrderValue) {
                discount = coupon.discountType === 'PERCENTAGE' ? subtotal * (coupon.discountValue / 100) : coupon.discountValue;
                if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
            }
        }

        const tax = subtotal * ((settings.taxPercentage || 5) / 100);
        const deliveryFee = settings.baseDeliveryFee || 40;
        const total = subtotal + tax + deliveryFee - discount;

        // Generate ID
        let orderId = generateOrderId();
        // Technically there's a tiny chance of collision, production could loop here but this is sufficient for now

        const order = await prisma.order.create({
            data: {
                id: orderId, userId: user.id, addressId,
                subtotal, tax, deliveryFee, discount, total, couponCode,
                paymentMethod, paymentStatus: 'PENDING',
                items: { create: itemsToCreate }
            }
        });

        if (paymentMethod === 'ONLINE' && settings.razorpayKeyId && settings.razorpayKeySecret) {
            const razorpay = new Razorpay({
                key_id: settings.razorpayKeyId,
                key_secret: settings.razorpayKeySecret
            });
            const rzpOrder = await razorpay.orders.create({
                amount: Math.round(total * 100),
                currency: 'INR',
                receipt: order.id
            });
            return NextResponse.json({
                success: true,
                orderId: order.id,
                needsPayment: true,
                razorpayOrderId: rzpOrder.id,
                amount: Math.round(total * 100),
                key: settings.razorpayKeyId
            });
        }

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
