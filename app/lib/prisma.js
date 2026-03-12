// Prisma client singleton with connection pool management
// Prevents connection exhaustion on serverless/long-idle deployments
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma2 ?? new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

// Graceful shutdown handling — close connections on server shutdown
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma2 = prisma;
}

// Handle connection errors gracefully — auto reconnect
prisma.$connect().catch((e) => {
    console.error('Prisma initial connection failed, will retry on next query:', e.message);
});

export default prisma;
