import { verifySession } from '@/app/lib/auth';
import { getOrders } from '@/app/lib/dataManager';
import OrdersClient from './OrdersClient';

export const metadata = { title: 'Manage Orders | FoodiClub Admin' };

export default async function AdminOrders() {
    const admin = await verifySession();
    if (!admin) return null;

    const orders = await getOrders();
    return <OrdersClient initialOrders={orders} />;
}
