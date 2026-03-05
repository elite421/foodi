// Force cache bust on Vercel for new schemas (e.g. Brands)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma2 ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma2 = prisma;

export default prisma;
