import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifySession } from '@/app/lib/auth';

export async function GET() {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(coupons);
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req) {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const code = data.code?.toUpperCase();

        const exists = await prisma.coupon.findUnique({ where: { code } });
        if (exists) return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });

        const coupon = await prisma.coupon.create({
            data: { ...data, code }
        });
        return NextResponse.json({ success: true, coupon });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(req) {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, ...data } = await req.json();
        const coupon = await prisma.coupon.update({
            where: { id }, data: { ...data, code: data.code?.toUpperCase() }
        });
        return NextResponse.json({ success: true, coupon });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req) {
    try {
        const admin = await verifySession();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = Number(searchParams.get('id'));
        await prisma.coupon.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
