import { NextResponse } from 'next/server';
import { withApiKey } from '@/app/lib/apiKeyAuth';
import prisma from '@/app/lib/prisma';

/**
 * GET /api/external/menu
 * Get menu items - requires API key with 'read' permission
 */
async function getMenuHandler(request) {
    try {
        const menuItems = await prisma.menuItem.findMany({
            where: { isAvailable: true },
            orderBy: { sortOrder: 'asc' },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: menuItems,
            meta: {
                total: menuItems.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('External API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu items' },
            { status: 500 }
        );
    }
}

export const GET = withApiKey(getMenuHandler, ['read']);
