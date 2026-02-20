import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MenuSection from '../components/MenuSection';
import { readData } from '../lib/dataManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Menu - FoodiClub | Order Food Online', description: 'Browse our complete menu on FoodiClub' };

export default async function MenuPage() {
    const data = await readData();
    return (
        <>
            <Navbar settings={data.settings} />
            <main style={{ minHeight: '60vh', padding: '2rem 0', maxWidth: 1200, margin: '0 auto' }}>
                <MenuSection menuItems={data.menuItems || []} categories={data.categories || []} />
            </main>
            <Footer settings={data.settings} />
        </>
    );
}
