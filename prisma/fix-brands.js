import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing brand names...');
    
    // Fix Authentic Bowl -> Authentic Bowls
    await prisma.brand.updateMany({
        where: { slug: 'authentic-bowl' },
        data: { 
            name: 'Authentic Bowls',
            slug: 'authentic-bowls',
            image: '/logos/authentic bowls final.png'
        }
    });
    
    // Fix the royal biryani -> The Royal Biryani
    await prisma.brand.updateMany({
        where: { slug: 'the-royal-biryani' },
        data: { 
            name: 'The Royal Biryani',
            image: '/logos/the royal biryani final.png'
        }
    });
    
    // Ensure all brand images are correct
    const brandUpdates = [
        { slug: 'authentic-bowls', image: '/logos/authentic bowls final.png' },
        { slug: 'the-lunch-box', image: '/logos/the lunch box final.png' },
        { slug: 'the-royal-biryani', image: '/logos/the royal biryani final.png' },
        { slug: 'wapi', image: '/logos/wapi final.png' }
    ];
    
    for (const update of brandUpdates) {
        await prisma.brand.updateMany({
            where: { slug: update.slug },
            data: { image: update.image }
        });
    }
    
    // List final brands
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    console.log('\n📊 Final brands in database:');
    brands.forEach(b => console.log(`  - ${b.name} (${b.slug})`));
    console.log(`\n✅ Total: ${brands.length} brands`);
}

main()
    .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
