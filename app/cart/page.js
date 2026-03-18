import { getAllSiteData } from '@/app/lib/db';
import CartClient from './CartClient';
import Navbar from '@/app/components/Navbar';

export const metadata = { title: 'Your Cart | FooodieClub' };
export const dynamic = 'force-dynamic';

export default async function CartPage() {
    const data = await getAllSiteData();

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar settings={data.settings} />
            <CartClient settings={data.settings} />
        </div>
    );
}
