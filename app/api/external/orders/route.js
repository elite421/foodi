import { NextResponse } from 'next/server';
import { withApiKey } from '@/app/lib/apiKeyAuth';
import prisma from '@/app/lib/prisma';

/**
 * GET /api/external/orders
 * Get orders (limited data) - requires API key with 'orders' permission
 */
async function getOrdersHandler(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');

        const where = {};
        if (status) where.status = status;

        const orders = await prisma.order.findMany({
            where,
            take: Math.min(limit, 100), // Max 100 records
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                status: true,
                paymentStatus: true,
                total: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        phone: true
                    }
                },
                items: {
                    select: {
                        quantity: true,
                        priceAtTime: true,
                        menuItem: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: orders,
            meta: {
                count: orders.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('External API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/external/orders
 * Create a new order - requires API key with 'write' permission
 */
async function createOrderHandler(request) {
    try {
        const body = await request.json();
        const { items, customerName, customerPhone, address, total } = body;

        if (!items || !items.length || !customerName || !customerPhone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create a guest user or use existing
        let user = await prisma.user.findFirst({
            where: { phone: customerPhone }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: customerName,
                    phone: customerPhone,
                    role: 'CUSTOMER'
                }
            });
        }

        // Generate order ID
        const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();

        // Create order
        const order = await prisma.order.create({
            data: {
                id: orderId,
                userId: user.id,
                total: total || 0,
                subtotal: total || 0,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                paymentMethod: 'COD',
                items: {
                    create: items.map(item => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        priceAtTime: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('External API error:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export const GET = withApiKey(getOrdersHandler, ['orders', 'read']);
export const POST = withApiKey(createOrderHandler, ['orders', 'write']);
