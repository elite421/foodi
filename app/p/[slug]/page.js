import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { readData } from '../../lib/dataManager';
import prisma from '../../lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page || !page.published) return { title: 'Page Not Found' };
    return { title: `${page.title} - FoodiClub`, description: page.metaDescription || '' };
}

export default async function CustomPage({ params }) {
    const { slug } = await params;
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page || !page.published) notFound();
    const data = await readData();
    return (
        <>
            <Navbar settings={data.settings} />
            <main style={{ minHeight: '60vh', padding: '3rem 2rem', maxWidth: 900, margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>{page.title}</h1>
                <div style={{ lineHeight: 1.8, color: '#374151', fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: page.content }} />
            </main>
            <Footer settings={data.settings} />
        </>
    );
}
