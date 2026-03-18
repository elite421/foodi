import { readData } from '@/app/lib/dataManager';
import CheckoutClient from './CheckoutClient';
import { verifyUserSession } from '@/app/lib/auth';
import Navbar from '@/app/components/Navbar';

export const metadata = { title: 'Checkout | FooodieClub' };
export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
    const data = await readData();
    const user = await verifyUserSession();
    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar settings={data.settings} />
            <CheckoutClient settings={data.settings} coupons={data.coupons} initialUser={user} />
        </div>
    );
}
