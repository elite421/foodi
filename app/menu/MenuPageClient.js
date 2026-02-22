'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import MenuSection from '../components/MenuSection';

function MenuContent({ menuItems, categories }) {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    return (
        <MenuSection
            menuItems={menuItems}
            categories={categories}
            initialCategory={category || undefined}
        />
    );
}

export default function MenuPageClient({ menuItems, categories }) {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading menu...</div>}>
            <MenuContent menuItems={menuItems} categories={categories} />
        </Suspense>
    );
}
