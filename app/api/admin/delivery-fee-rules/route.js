import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

// Get all delivery fee rules
export async function GET() {
    try {
        const rules = await prisma.deliveryFeeRule.findMany({
            orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }]
        });
        return NextResponse.json({ rules });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Create new delivery fee rule
export async function POST(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const body = await request.json();
        const rule = await prisma.deliveryFeeRule.create({
            data: {
                name: body.name,
                description: body.description,
                conditionType: body.conditionType,
                minOrderValue: body.minOrderValue,
                maxOrderValue: body.maxOrderValue,
                minDistance: body.minDistance,
                maxDistance: body.maxDistance,
                startTime: body.startTime,
                endTime: body.endTime,
                daysOfWeek: JSON.stringify(body.daysOfWeek || []),
                feeType: body.feeType,
                feeValue: body.feeValue,
                feePercentage: body.feePercentage,
                perKmRate: body.perKmRate,
                maxFee: body.maxFee,
                priority: body.priority || 0,
                isActive: body.isActive ?? true
            }
        });
        return NextResponse.json({ success: true, rule });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Update delivery fee rule
export async function PUT(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const body = await request.json();
        const { id, ...data } = body;
        
        if (data.daysOfWeek) {
            data.daysOfWeek = JSON.stringify(data.daysOfWeek);
        }
        
        const rule = await prisma.deliveryFeeRule.update({
            where: { id },
            data
        });
        return NextResponse.json({ success: true, rule });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Delete delivery fee rule
export async function DELETE(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        await prisma.deliveryFeeRule.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
