import { readData } from '../../lib/dataManager';
import prisma from '../../lib/prisma';
import { notFound } from 'next/navigation';
import BrandClientWrapper from './BrandClientWrapper';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const brand = await prisma.brand.findUnique({ where: { slug, isActive: true } });
    if (!brand) return { title: 'Brand Not Found' };
    return { title: `${brand.name} - FooodieClub`, description: brand.description || '' };
}

export default async function BrandPage({ params }) {
    const { slug } = await params;

    const [brand, data] = await Promise.all([
        prisma.brand.findUnique({
            where: { slug, isActive: true },
            include: { menuItems: { include: { category: true } } }
        }),
        readData()
    ]);

    if (!brand) notFound();

    // Get unique categories for this brand's items
    const catMap = new Map();
    brand.menuItems.forEach(item => {
        if (item.category) {
            catMap.set(item.categoryId, item.category);
        }
    });
    const brandCategories = Array.from(catMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <BrandClientWrapper
            brand={brand}
            categories={brandCategories}
            menuItems={brand.menuItems}
            settings={data.settings}
        />
    );
}
