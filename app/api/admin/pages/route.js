import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

async function checkAdmin() { const a = await verifySession(); if (!a) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return null; }

export async function GET() {
    try {
        const pages = await prisma.page.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(pages);
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const b = await request.json();
        const slug = b.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const page = await prisma.page.create({
            data: { id: 'page-' + Date.now(), title: b.title, slug, content: b.content || '', metaDescription: b.metaDescription || b.meta_description || '', published: b.published !== false }
        });
        return NextResponse.json(page, { status: 201 });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const b = await request.json();
        const data = {};
        if (b.title !== undefined) data.title = b.title;
        if (b.slug !== undefined) data.slug = b.slug;
        if (b.content !== undefined) data.content = b.content;
        if (b.meta_description !== undefined) data.metaDescription = b.meta_description;
        if (b.metaDescription !== undefined) data.metaDescription = b.metaDescription;
        if (b.published !== undefined) data.published = !!b.published;
        await prisma.page.update({ where: { id: b.id }, data });
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const { searchParams } = new URL(request.url);
        await prisma.page.delete({ where: { id: searchParams.get('id') } });
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
