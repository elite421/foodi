import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import { getHero, updateHero } from '@/app/lib/dataManager';

export async function GET() {
    try {
        const hero = await getHero();
        return NextResponse.json(hero || {});
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(request) {
    const admin = await verifySession();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        // Map flat field names from admin form to Prisma model fields
        const data = {};
        if (body.title !== undefined) data.title = body.title;
        if (body.subtitle !== undefined) data.subtitle = body.subtitle;
        if (body.promo_text !== undefined) data.promoText = body.promo_text;
        if (body.search_placeholder !== undefined) data.searchPlaceholder = body.search_placeholder;
        if (body.stats_rating !== undefined) data.statsRating = body.stats_rating;
        if (body.stats_downloads !== undefined) data.statsDownloads = body.stats_downloads;
        if (body.stats_cities !== undefined) data.statsCities = body.stats_cities;
        if (body.banner_title !== undefined) data.bannerTitle = body.banner_title;
        if (body.banner_highlight !== undefined) data.bannerHighlight = body.banner_highlight;
        if (body.banner_subtitle !== undefined) data.bannerSubtitle = body.banner_subtitle;
        await updateHero(data);
        return NextResponse.json({ success: true });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
