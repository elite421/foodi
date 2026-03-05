import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';

async function checkAdmin() {
    const a = await verifySession();
    if (!a) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return null;
}

export async function GET() {
    try {
        if (!prisma.brand) return NextResponse.json([]);
        const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
        return NextResponse.json(brands);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const data = await req.json();
        const brand = await prisma.brand.create({
            data: {
                name: data.name || '',
                slug: data.slug || '',
                image: data.image || '',
                description: data.description || '',
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
        return NextResponse.json(brand, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const data = await req.json();
        const brand = await prisma.brand.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug: data.slug,
                image: data.image,
                description: data.description,
                isActive: data.isActive
            }
        });
        return NextResponse.json(brand);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await prisma.brand.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
