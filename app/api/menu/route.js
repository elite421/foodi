import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
    try {
        const menuItems = await prisma.menuItem.findMany({
            where: { isAvailable: true },
            orderBy: { sortOrder: 'asc' },
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                description: true,
                isVeg: true
            }
        });

        return NextResponse.json({ success: true, menuItems });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu items' },
            { status: 500 }
        );
    }
}
