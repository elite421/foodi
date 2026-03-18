import { verifyUserSession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import Navbar from '@/app/components/Navbar';
import { getAllSiteData } from '@/app/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function OrderDetails({ params }) {
    const { id } = await params;
    const user = await verifyUserSession();
    if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please sign in.</div>;

    const order = await prisma.order.findUnique({
        where: { id, userId: user.id },
        include: { address: true, items: { include: { menuItem: true } } }
    });

    if (!order) return notFound();

    const data = await getAllSiteData();

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar settings={data.settings} />
            <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
                <Link href="/account/orders" style={{ textDecoration: 'none', color: '#4338ca', fontWeight: 600, marginBottom: '1rem', display: 'inline-block' }}>
                    ← Back to Orders
                </Link>

                <div style={{ background: 'white', padding: '2rem', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Order #{order.id}</h1>
                            <div style={{ color: '#64748b' }}>{new Date(order.createdAt).toLocaleString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                background: order.status === 'DELIVERED' ? '#dcfce7' : order.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                                color: order.status === 'DELIVERED' ? '#166534' : order.status === 'CANCELLED' ? '#991b1b' : '#92400e',
                                padding: '6px 12px', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem'
                            }}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>Items</h2>
                    {order.items.map(i => (
                        <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <div><span style={{ fontWeight: 600 }}>{i.quantity} x</span> {i.menuItem.name}</div>
                            <div>₹{(i.priceAtTime * i.quantity).toFixed(2)}</div>
                        </div>
                    ))}

                    <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '1rem 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: '#64748b' }}>
                        <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: '#64748b' }}>
                        <span>Tax</span><span>₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: '#64748b' }}>
                        <span>Delivery Fee</span><span>₹{order.deliveryFee.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: '#10b981', fontWeight: 600 }}>
                            <span>Discount ({order.couponCode})</span><span>-₹{order.discount.toFixed(2)}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 800, fontSize: '1.4rem', borderTop: '2px solid #e2e8f0', marginTop: '1rem' }}>
                        <span>Total Paid</span><span>₹{order.total.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Payment Method: {order.paymentMethod}</div>
                            <div style={{ color: '#64748b' }}>Status: {order.paymentStatus} {order.paymentId ? `(${order.paymentId})` : ''}</div>
                        </div>
                        <a href={`/invoice/${order.id}`} target="_blank" style={{
                            padding: '10px 20px', background: '#4338ca', color: 'white', borderRadius: 8,
                            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
                        }}>
                            Download Invoice
                        </a>
                    </div>

                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>Delivery Details</h2>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{order.address.label}</div>
                        <div style={{ color: '#475569' }}>{order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
