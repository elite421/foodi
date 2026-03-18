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

    // Generate invoice number format: INV-YYYYMMDD-XXXX
    const orderDate = new Date(order.createdAt);
    const dateStr = orderDate.toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNumber = `INV-${dateStr}-${order.id.slice(-4)}`;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', background: 'white', padding: '3rem', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative' }}>
                <div className="no-print" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <PrintButton />
                    <style>{`@media print { .no-print { display: none !important; } }`}</style>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #4338ca', paddingBottom: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#4338ca' }}>{settings.siteName || 'FooodieClub'}</h1>
                        <p style={{ margin: '0.5rem 0', color: '#64748b', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                            {settings.address || '123 Food Street, New Delhi, India'}<br />
                            📞 {settings.phone || '1800-123-4567'}<br />
                            ✉️ {settings.email || 'support@fooodieclub.com'}
                        </p>
                        <p style={{ margin: '0.25rem 0', color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
                            GSTIN: 07AABCU9603R1ZX
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px' }}>TAX INVOICE</h2>
                        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            <div style={{ marginBottom: '4px' }}><strong style={{ color: '#475569' }}>Invoice #:</strong> {invoiceNumber}</div>
                            <div style={{ marginBottom: '4px' }}><strong style={{ color: '#475569' }}>Invoice Date:</strong> {new Date().toLocaleDateString('en-IN')}</div>
                            <div style={{ marginBottom: '4px' }}><strong style={{ color: '#475569' }}>Order Date:</strong> {orderDate.toLocaleDateString('en-IN')}</div>
                            <div><strong style={{ color: '#475569' }}>Order ID:</strong> #{order.id}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem' }}>
                    <div style={{ flex: 1, padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 0.75rem 0', color: '#4338ca', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill To:</h3>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{order.user.name}</div>
                        <div style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.25rem' }}>📞 {order.user.phone || 'N/A'}</div>
                        <div style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.25rem' }}>✉️ {order.user.email}</div>
                        {order.address && (
                            <div style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                <strong>Delivery Address:</strong><br />
                                {order.address.label && <span>{order.address.label}<br /></span>}
                                {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zip}
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 0.75rem 0', color: '#4338ca', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Details:</h3>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Method:</strong> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</div>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Status:</strong> 
                            <span style={{ 
                                color: order.paymentStatus === 'COMPLETED' ? '#22c55e' : 
                                       order.paymentStatus === 'PENDING' ? '#f59e0b' : '#ef4444',
                                fontWeight: 600,
                                marginLeft: '5px'
                            }}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        {order.paymentId && <div style={{ fontSize: '0.85rem', color: '#64748b' }}><strong>Txn ID:</strong> {order.paymentId}</div>}
                        <div style={{ marginTop: '1rem' }}><strong>Order Status:</strong>
                            <span style={{
                                display: 'inline-block',
                                marginLeft: '8px',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: order.status === 'DELIVERED' ? '#dcfce7' :
                                            order.status === 'CANCELLED' ? '#fee2e2' :
                                            order.status === 'PENDING' ? '#fef3c7' : '#e0e7ff',
                                color: order.status === 'DELIVERED' ? '#166534' :
                                       order.status === 'CANCELLED' ? '#991b1b' :
                                       order.status === 'PENDING' ? '#92400e' : '#3730a3',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase'
                            }}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                    <thead>
                        <tr style={{ background: '#4338ca', color: 'white' }}>
                            <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>#</th>
                            <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Item Description</th>
                            <th style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Qty</th>
                            <th style={{ padding: '14px 12px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Rate (₹)</th>
                            <th style={{ padding: '14px 12px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((i, idx) => (
                            <tr key={i.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>{idx + 1}</td>
                                <td style={{ padding: '12px', textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600 }}>{i.menuItem.name}</div>
                                    {i.menuItem.description && (
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                                            {i.menuItem.description.slice(0, 40)}...
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{i.quantity}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>₹{i.priceAtTime.toFixed(2)}</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>₹{(i.priceAtTime * i.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '320px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0', color: '#475569' }}>
                            <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0', color: '#475569' }}>
                            <span>GST (5%)</span><span>₹{order.tax.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0', color: '#475569' }}>
                            <span>Delivery Fee</span><span>₹{order.deliveryFee.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0', color: '#22c55e', fontWeight: 600 }}>
                                <span>Discount {order.couponCode && `(${order.couponCode})`}</span><span>-₹{order.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', marginTop: '8px', fontSize: '1.3rem', fontWeight: 800, color: '#4338ca', borderTop: '3px solid #4338ca' }}>
                            <span>Total Amount</span><span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            <strong style={{ color: '#4338ca' }}>Terms & Conditions:</strong>
                            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li>Payment is due upon receipt of invoice.</li>
                                <li>Goods once sold will not be taken back.</li>
                                <li>All disputes subject to Delhi jurisdiction.</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                        <p style={{ margin: '0.5rem 0', fontSize: '1rem', fontWeight: 600, color: '#4338ca' }}>Thank you for your order!</p>
                        <p style={{ margin: '0.5rem 0' }}>This is a computer generated invoice and does not require signature.</p>
                        <p style={{ margin: '0.5rem 0' }}>For any queries, contact us at {settings.phone || '1800-123-4567'} or {settings.email || 'support@fooodieclub.com'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
