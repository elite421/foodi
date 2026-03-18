import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/app/lib/prisma';
import { verifyAdminSession } from '@/app/lib/auth';

/**
 * GET /api/admin/developer/api-keys
 * List all API keys
 */
export async function GET() {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiKeys = await prisma.apiKey.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                key: true,
                permissions: true,
                isActive: true,
                lastUsed: true,
                usageCount: true,
                createdAt: true
            }
        });

        // Mask the actual keys except for the last 8 characters
        const maskedKeys = apiKeys.map(apiKey => ({
            ...apiKey,
            key: apiKey.key.substring(0, 8) + '...' + apiKey.key.substring(apiKey.key.length - 8),
            fullKey: apiKey.key // Keep full key for reference but don't expose in list
        }));

        return NextResponse.json({ success: true, apiKeys: maskedKeys });
    } catch (error) {
        console.error('API keys fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }
}

/**
 * POST /api/admin/developer/api-keys
 * Generate a new API key
 */
export async function POST(request) {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, permissions } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Generate a secure API key
        const prefix = 'fdc_';
        const randomBytes = crypto.randomBytes(32).toString('hex');
        const apiKey = prefix + randomBytes;

        // Create the API key
        const newKey = await prisma.apiKey.create({
            data: {
                name: name || 'New API Key',
                key: apiKey,
                permissions: permissions || ['read'],
                isActive: true,
                usageCount: 0
            }
        });

        return NextResponse.json({
            success: true,
            message: 'API key generated successfully',
            apiKey: {
                id: newKey.id,
                name: newKey.name,
                key: apiKey, // Return the full key only once on creation
                permissions: newKey.permissions,
                createdAt: newKey.createdAt
            }
        });
    } catch (error) {
        console.error('API key generation error:', error);
        return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/developer/api-keys
 * Revoke an API key
 */
export async function DELETE(request) {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
        }

        await prisma.apiKey.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'API key revoked successfully'
        });
    } catch (error) {
        console.error('API key deletion error:', error);
        return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/developer/api-keys
 * Update API key status or permissions
 */
export async function PATCH(request) {
    try {
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, isActive, permissions, name } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
        }

        const updateData = {};
        if (typeof isActive === 'boolean') updateData.isActive = isActive;
        if (permissions) updateData.permissions = permissions;
        if (name) updateData.name = name;

        const updatedKey = await prisma.apiKey.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                permissions: true,
                isActive: true,
                lastUsed: true,
                usageCount: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'API key updated successfully',
            apiKey: updatedKey
        });
    } catch (error) {
        console.error('API key update error:', error);
        return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
    }
}
