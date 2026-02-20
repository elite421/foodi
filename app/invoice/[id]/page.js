import { verifyUserSession, verifySession } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';

export default async function InvoicePage({ params }) {
    const { id } = await params;

    // Check if user is logged in (owner) OR admin is logged in
    const user = await verifyUserSession();
    const admin = await verifySession();

    if (!user && !admin) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Unauthorized to view invoice.</div>;
    }

    const order = await prisma.order.findUnique({
        where: { id },
        include: { address: true, items: { include: { menuItem: true } }, user: true }
    });

    if (!order) return notFound();
    if (!admin && order.userId !== user.id) return <div style={{ padding: '2rem', textAlign: 'center' }}>Unauthorized to view invoice.</div>;

    const settings = await prisma.settings.findFirst({ where: { id: 1 } });

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', background: 'white', padding: '3rem', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative' }}>
                <div className="no-print" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <PrintButton />
                    <style>{`@media print { .no-print { display: none !important; } }`}</style>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>{settings.siteName || 'FoodiClub'}</h1>
                        <p style={{ margin: '0.5rem 0', color: '#64748b', whiteSpace: 'pre-line' }}>
                            {settings.address || '123 Food Street'}<br />
                            Phone: {settings.phone || '1800-123-4567'}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#4338ca', textTransform: 'uppercase' }}>INVOICE</h2>
                        <div style={{ marginTop: '0.5rem' }}>
                            <div><strong style={{ color: '#475569' }}>Order #:</strong> {order.id}</div>
                            <div><strong style={{ color: '#475569' }}>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>Bill To:</h3>
                        <div style={{ fontWeight: 700 }}>{order.user.name}</div>
                        <div style={{ color: '#475569' }}>{order.user.phone || order.user.email}</div>
                        {order.address && (
                            <div style={{ color: '#475569', marginTop: 4 }}>
                                {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}
                            </div>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>Payment Info:</h3>
                        <div><strong>Method:</strong> {order.paymentMethod}</div>
                        <div><strong>Status:</strong> {order.paymentStatus}</div>
                        {order.paymentId && <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Txn: {order.paymentId}</div>}
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                    <thead>
                        <tr style={{ background: '#f1f5f9' }}>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>Item</th>
                            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #cbd5e1' }}>Qty</th>
                            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #cbd5e1' }}>Price</th>
                            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #cbd5e1' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(i => (
                            <tr key={i.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px', textAlign: 'left' }}>{i.menuItem.name}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{i.quantity}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>₹{i.priceAtTime.toFixed(2)}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>₹{(i.priceAtTime * i.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#475569' }}>
                            <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#475569' }}>
                            <span>Tax</span><span>₹{order.tax.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#475569' }}>
                            <span>Delivery Fee</span><span>₹{order.deliveryFee.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#10b981', fontWeight: 600 }}>
                                <span>Discount</span><span>-₹{order.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #e2e8f0', marginTop: '12px', fontSize: '1.2rem', fontWeight: 800 }}>
                            <span>Invoice Total</span><span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    Thank you for your business!
                </div>
            </div>
        </div>
    );
}
