import { verifyUserSession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import Navbar from '@/app/components/Navbar';
import { getAllSiteData } from '@/app/lib/db';
import Link from 'next/link';

export default async function UserOrders() {
    const user = await verifyUserSession();
    if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please sign in.</div>;

    const orders = await prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    const data = await getAllSiteData();

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar settings={data.settings} />
            <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>My Orders</h1>
                {orders.length === 0 ? <p>No orders yet.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.map(o => (
                            <Link href={`/account/orders/${o.id}`} key={o.id} style={{
                                background: 'white', padding: '1.5rem', borderRadius: 16, textDecoration: 'none', color: 'inherit',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between'
                            }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>Order #{o.id}</h3>
                                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>{new Date(o.createdAt).toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>₹{o.total.toFixed(2)}</div>
                                    <div style={{
                                        color: o.status === 'DELIVERED' ? '#10b981' : o.status === 'CANCELLED' ? '#ef4444' : '#f59e0b',
                                        fontSize: '0.9rem', fontWeight: 600
                                    }}>{o.status}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
