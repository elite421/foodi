import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

/**
 * Verify API key from request headers
 * Returns the API key record if valid, null otherwise
 */
export async function verifyApiKey(request) {
    try {
        // Get API key from Authorization header or X-API-Key header
        const authHeader = request.headers.get('authorization');
        const apiKeyHeader = request.headers.get('x-api-key');
        
        let apiKey = null;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            apiKey = authHeader.substring(7);
        } else if (apiKeyHeader) {
            apiKey = apiKeyHeader;
        }
        
        if (!apiKey) {
            return null;
        }
        
        // Find the API key in database
        const keyRecord = await prisma.apiKey.findUnique({
            where: { key: apiKey }
        });
        
        if (!keyRecord || !keyRecord.isActive) {
            return null;
        }
        
        // Update usage stats
        await prisma.apiKey.update({
            where: { id: keyRecord.id },
            data: {
                lastUsed: new Date(),
                usageCount: { increment: 1 }
            }
        });
        
        return keyRecord;
    } catch (error) {
        console.error('API key verification error:', error);
        return null;
    }
}

/**
 * Middleware to protect external API routes
 * Usage: import { withApiKey } from '@/app/lib/apiKeyAuth'
 */
export function withApiKey(handler, requiredPermissions = []) {
    return async function(request, context) {
        const apiKey = await verifyApiKey(request);
        
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid or missing API key' },
                { status: 401 }
            );
        }
        
        // Check required permissions
        if (requiredPermissions.length > 0) {
            const hasPermission = requiredPermissions.every(perm => 
                apiKey.permissions.includes(perm) || apiKey.permissions.includes('admin')
            );
            
            if (!hasPermission) {
                return NextResponse.json(
                    { error: 'Forbidden - Insufficient permissions' },
                    { status: 403 }
                );
            }
        }
        
        // Add API key info to request for use in handler
        request.apiKey = apiKey;
        
        return handler(request, context);
    };
}
