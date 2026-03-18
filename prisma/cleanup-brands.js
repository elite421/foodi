import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning up old brands...');
    
    // Delete old brands that are not in the new set
    const oldBrandSlugs = ['pizza-hut', 'burger-king', 'dominos'];
    
    for (const slug of oldBrandSlugs) {
        try {
            await prisma.brand.deleteMany({
                where: { slug: slug }
            });
            console.log(`✅ Deleted brand: ${slug}`);
        } catch (e) {
            console.log(`⚠️ Brand not found or error: ${slug}`);
        }
    }
    
    // List remaining brands
    const brands = await prisma.brand.findMany();
    console.log('\n📊 Current brands in database:');
    brands.forEach(b => console.log(`  - ${b.name} (${b.slug})`));
    
    console.log(`\n✅ Total brands: ${brands.length}`);
}

main()
    .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
