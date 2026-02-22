import { getCollectionById, getMenuItems } from '@/app/lib/dataManager';
import { getSettings } from '@/app/lib/dataManager';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CollectionPageClient from './CollectionPageClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const col = await getCollectionById(id);
    if (!col) return { title: 'Collection Not Found' };
    return {
        title: `${col.title} - FoodiClub`,
        description: col.description || `Browse ${col.title} collection at FoodiClub`,
    };
}

export default async function CollectionPage({ params }) {
    const { id } = await params;
    const [collection, allItems, settings] = await Promise.all([
        getCollectionById(id),
        getMenuItems(),
        getSettings(),
    ]);

    if (!collection) notFound();

    // Parse menu item IDs and filter items
    let itemIds = [];
    try {
        itemIds = JSON.parse(collection.menuItemIds || '[]');
    } catch { itemIds = []; }

    const collectionItems = itemIds.length > 0
        ? allItems.filter(item => itemIds.includes(item.id))
        : allItems;

    const settingsData = settings ? {
        siteName: settings.siteName, tagline: settings.tagline, domain: settings.domain,
        phone: settings.phone, email: settings.email, address: settings.address,
        socialLinks: { facebook: settings.facebook, instagram: settings.instagram, twitter: settings.twitter },
        primaryColor: settings.primaryColor, secondaryColor: settings.secondaryColor,
    } : {};

    return (
        <>
            <Navbar settings={settingsData} />
            <CollectionPageClient
                collection={{
                    id: collection.id,
                    title: collection.title,
                    image: collection.image,
                    description: collection.description,
                }}
                menuItems={collectionItems.map(m => ({
                    id: m.id,
                    name: m.name,
                    description: m.description,
                    image: m.image,
                    price: m.price,
                    isVeg: m.isVeg,
                    isAvailable: m.isAvailable,
                    categoryName: m.category?.name || '',
                }))}
                settings={settingsData}
            />
            <Footer settings={settingsData} />
        </>
    );
}
