import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import { getSettings, updateSettings } from '@/app/lib/dataManager';

export async function GET() {
    try { return NextResponse.json(await getSettings()); }
    catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        // Map snake_case from admin form to Prisma camelCase
        const data = {};
        if (body.site_name !== undefined) data.siteName = body.site_name;
        if (body.tagline !== undefined) data.tagline = body.tagline;
        if (body.domain !== undefined) data.domain = body.domain;
        if (body.phone !== undefined) data.phone = body.phone;
        if (body.email !== undefined) data.email = body.email;
        if (body.address !== undefined) data.address = body.address;
        if (body.facebook !== undefined) data.facebook = body.facebook;
        if (body.instagram !== undefined) data.instagram = body.instagram;
        if (body.twitter !== undefined) data.twitter = body.twitter;
        if (body.primary_color !== undefined) data.primaryColor = body.primary_color;
        if (body.secondary_color !== undefined) data.secondaryColor = body.secondary_color;

        if (body.restaurantLat !== undefined) data.restaurantLat = body.restaurantLat;
        if (body.restaurantLng !== undefined) data.restaurantLng = body.restaurantLng;
        if (body.deliveryRadius !== undefined) data.deliveryRadius = body.deliveryRadius;
        if (body.taxPercentage !== undefined) data.taxPercentage = body.taxPercentage;
        if (body.baseDeliveryFee !== undefined) data.baseDeliveryFee = body.baseDeliveryFee;

        if (body.razorpayKeyId !== undefined) data.razorpayKeyId = body.razorpayKeyId;
        if (body.razorpayKeySecret !== undefined) data.razorpayKeySecret = body.razorpayKeySecret;

        await updateSettings(data);
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
