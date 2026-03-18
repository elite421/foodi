import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

// Get all additional fees
export async function GET() {
    try {
        const fees = await prisma.additionalFee.findMany({
            orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }]
        });
        return NextResponse.json({ fees });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Create new additional fee
export async function POST(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const body = await request.json();
        const fee = await prisma.additionalFee.create({
            data: {
                name: body.name,
                description: body.description,
                applyTo: body.applyTo,
                minOrderValue: body.minOrderValue,
                maxOrderValue: body.maxOrderValue,
                feeType: body.feeType,
                feeValue: body.feeValue,
                feePercentage: body.feePercentage,
                maxFee: body.maxFee,
                minFee: body.minFee,
                isTaxable: body.isTaxable ?? false,
                showInBreakdown: body.showInBreakdown ?? true,
                priority: body.priority || 0,
                isActive: body.isActive ?? false
            }
        });
        return NextResponse.json({ success: true, fee });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Update additional fee
export async function PUT(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const body = await request.json();
        const { id, ...data } = body;
        
        const fee = await prisma.additionalFee.update({
            where: { id },
            data
        });
        return NextResponse.json({ success: true, fee });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Delete additional fee
export async function DELETE(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        await prisma.additionalFee.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
