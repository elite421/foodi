import { NextResponse } from 'next/server';
import { withApiKey } from '@/app/lib/apiKeyAuth';
import prisma from '@/app/lib/prisma';

/**
 * GET /api/external/categories
 * Get all categories - requires API key with 'read' permission
 */
async function getCategoriesHandler(request) {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true
            }
        });

        return NextResponse.json({
            success: true,
            data: categories,
            meta: {
                total: categories.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('External API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export const GET = withApiKey(getCategoriesHandler, ['read']);
