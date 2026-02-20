import { readData } from '@/app/lib/dataManager';
import CheckoutClient from './CheckoutClient';
import { verifyUserSession } from '@/app/lib/auth';

export const metadata = { title: 'Checkout | FoodiClub' };

export default async function CheckoutPage() {
    const data = await readData();
    const user = await verifyUserSession();
    return <CheckoutClient settings={data.settings} coupons={data.coupons} initialUser={user} />;
}
