'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersClient({ initialOrders }) {
    const [orders, setOrders] = useState(initialOrders);
    const [loading, setLoading] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const router = useRouter();


    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    const updateStatus = async (id, status) => {
        setLoading(id);
        const res = await fetch('/api/admin/orders', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        });
        if (res.ok) {
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        }
        setLoading(null);
    };

    return (
        <div className="admin-page">
            <h1 className="admin-h1">Manage Orders</h1>

            {selectedOrder && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
                    justifyContent: 'center', alignItems: 'center'
                }} onClick={() => setSelectedOrder(null)}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: 16, width: '90%',
                        maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedOrder(null)} style={{
                            position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
                            fontSize: '1.5rem', cursor: 'pointer', color: '#64748b'
                        }}>✕</button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1.5rem 0' }}>Order Details: {selectedOrder.id}</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8 }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#4338ca' }}>Customer</h3>
                                <div><strong>Name:</strong> {selectedOrder.user.name}</div>
                                <div><strong>Email:</strong> {selectedOrder.user.email}</div>
                                <div><strong>Phone:</strong> {selectedOrder.user.phone}</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8 }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#4338ca' }}>Payment Info</h3>
                                <div><strong>Method:</strong> {selectedOrder.paymentMethod}</div>
                                <div><strong>Status:</strong> {selectedOrder.paymentStatus}</div>
                                {selectedOrder.paymentId && <div><strong>Txn ID:</strong> {selectedOrder.paymentId}</div>}
                                <div><strong>Total Paid:</strong> ₹{selectedOrder.total.toFixed(2)}</div>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, marginBottom: '2rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#4338ca' }}>Delivery Details</h3>
                            {selectedOrder.address ? (
                                <div>{selectedOrder.address.label} - {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zip}</div>
                            ) : (
                                <div>Self Pickup</div>
                            )}
                            {selectedOrder.specialInstructions && (
                                <div style={{ marginTop: '0.5rem', color: '#b45309', background: '#fef3c7', padding: '8px', borderRadius: 4 }}>
                                    <strong>Note:</strong> {selectedOrder.specialInstructions}
                                </div>
                            )}
                        </div>

                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Order Items</h3>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f1f5f9' }}>
                                    <tr>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Item</th>
                                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Qty</th>
                                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map(i => (
                                        <tr key={i.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '12px', textAlign: 'left' }}>{i.menuItem.name}</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>{i.quantity}</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>₹{(i.priceAtTime * i.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', color: '#475569' }}>
                            <div style={{ width: 200, display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><span>₹{selectedOrder.subtotal.toFixed(2)}</span></div>
                            <div style={{ width: 200, display: 'flex', justifyContent: 'space-between' }}><span>Tax:</span><span>₹{selectedOrder.tax.toFixed(2)}</span></div>
                            <div style={{ width: 200, display: 'flex', justifyContent: 'space-between' }}><span>Delivery Fee:</span><span>₹{selectedOrder.deliveryFee.toFixed(2)}</span></div>
                            {selectedOrder.discount > 0 && (
                                <div style={{ width: 200, display: 'flex', justifyContent: 'space-between', color: '#10b981' }}><span>Discount:</span><span>-₹{selectedOrder.discount.toFixed(2)}</span></div>
                            )}
                            <div style={{ width: 200, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', borderTop: '2px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                <span>Total:</span><span>₹{selectedOrder.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Address</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center' }}>No orders found</td></tr>}
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td><strong style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{o.id}</strong></td>
                                <td>{new Date(o.createdAt).toLocaleString()}</td>
                                <td>
                                    <div><strong>{o.user.name}</strong></div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{o.user.phone || o.user.email}</div>
                                </td>
                                <td style={{ maxWidth: 200 }}>
                                    {o.address ? `${o.address.street}, ${o.address.city}` : 'Pickup'}
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                        {o.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                                    </div>
                                </td>
                                <td><strong>₹{o.total.toFixed(2)}</strong></td>
                                <td>
                                    <span style={{
                                        background: o.status === 'DELIVERED' ? '#dcfce7' : o.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                                        color: o.status === 'DELIVERED' ? '#166534' : o.status === 'CANCELLED' ? '#991b1b' : '#92400e',
                                        padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem', fontWeight: 700
                                    }}>
                                        {o.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <select
                                            value={o.status}
                                            disabled={loading === o.id || o.status === 'CANCELLED' || o.status === 'DELIVERED'}
                                            onChange={(e) => updateStatus(o.id, e.target.value)}
                                            style={{ padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="ACCEPTED">Accepted</option>
                                            <option value="PREPARING">Preparing</option>
                                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                        <a href={`/invoice/${o.id}`} target="_blank" style={{
                                            padding: '6px 10px', background: '#3b82f6', color: 'white', borderRadius: 6,
                                            textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600
                                        }}>
                                            Invoice
                                        </a>
                                        <button onClick={() => setSelectedOrder(o)} style={{
                                            padding: '6px 10px', background: '#10b981', color: 'white', borderRadius: 6,
                                            border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                                        }}>
                                            View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
