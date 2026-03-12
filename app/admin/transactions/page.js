'use client';
import { useState, useEffect } from 'react';

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [methodFilter, setMethodFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedTxn, setSelectedTxn] = useState(null);

    const fetchData = async (p = 1, q = '', st = '', meth = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: p, search: q });
            if (st) params.set('status', st);
            if (meth) params.set('paymentMethod', meth);
            const res = await fetch(`/api/admin/transactions?${params.toString()}`);
            const data = await res.json();
            setTransactions(data.transactions || []);
            setSummary(data.summary || null);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchData(1, search, statusFilter, methodFilter); };
    const handleFilter = (st, meth) => { setStatusFilter(st); setMethodFilter(meth); setPage(1); fetchData(1, search, st, meth); };
    const handlePageChange = (p) => { setPage(p); fetchData(p, search, statusFilter, methodFilter); };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const paymentStatusBadge = (s) => {
        const map = {
            COMPLETED: { bg: '#dcfce7', color: '#16a34a' },
            PENDING: { bg: '#fef3c7', color: '#d97706' },
            FAILED: { bg: '#fee2e2', color: '#dc2626' },
            REFUNDED: { bg: '#e0e7ff', color: '#4338ca' },
        };
        const c = map[s] || { bg: '#f1f5f9', color: '#64748b' };
        return (
            <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem' }}>
                {s}
            </span>
        );
    };

    const methodBadge = (m) => {
        const isOnline = m === 'ONLINE';
        return (
            <span style={{
                background: isOnline ? '#dbeafe' : '#fef3c7',
                color: isOnline ? '#2563eb' : '#92400e',
                padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem'
            }}>
                {m}
            </span>
        );
    };

    return (
        <>
            <div className="admin-header">
                <h1>💳 Transactions</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 14px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>
                        {total} total
                    </span>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="admin-stats">
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-value" style={{ color: '#10b981' }}>₹{summary.totalRevenue.toFixed(0)}</div>
                        <div className="stat-label">Total Revenue</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-value" style={{ color: '#4338ca' }}>{summary.totalOrders}</div>
                        <div className="stat-label">Total Orders</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏧</div>
                        <div className="stat-value" style={{ color: '#f59e0b' }}>{summary.codOrders}</div>
                        <div className="stat-label">COD Orders</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💳</div>
                        <div className="stat-value" style={{ color: '#3b82f6' }}>{summary.onlineOrders}</div>
                        <div className="stat-label">Online Payments</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-value" style={{ color: '#8b5cf6' }}>₹{summary.totalTax.toFixed(0)}</div>
                        <div className="stat-label">Tax Collected</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🚚</div>
                        <div className="stat-value" style={{ color: '#06b6d4' }}>₹{summary.totalDeliveryFees.toFixed(0)}</div>
                        <div className="stat-label">Delivery Fees</div>
                    </div>
                </div>
            )}

            <div className="admin-card">
                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 250 }}>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Payment ID, name, phone..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                        />
                        <button type="submit" className="btn-admin btn-admin-primary">Search</button>
                    </form>
                    <select
                        value={statusFilter}
                        onChange={e => handleFilter(e.target.value, methodFilter)}
                        style={{ padding: '10px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.9rem', background: 'white' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                        <option value="REFUNDED">Refunded</option>
                    </select>
                    <select
                        value={methodFilter}
                        onChange={e => handleFilter(statusFilter, e.target.value)}
                        style={{ padding: '10px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.9rem', background: 'white' }}
                    >
                        <option value="">All Methods</option>
                        <option value="COD">COD</option>
                        <option value="ONLINE">Online</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No transactions found</div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Payment Status</th>
                                        <th>Order Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t.id}>
                                            <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{t.id}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{t.userName}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.userPhone}</div>
                                            </td>
                                            <td style={{ fontWeight: 700 }}>₹{t.total.toFixed(2)}</td>
                                            <td>{methodBadge(t.paymentMethod)}</td>
                                            <td>{paymentStatusBadge(t.paymentStatus)}</td>
                                            <td>
                                                <span style={{
                                                    fontSize: '0.8rem', fontWeight: 600,
                                                    color: t.orderStatus === 'DELIVERED' ? '#10b981' : t.orderStatus === 'CANCELLED' ? '#ef4444' : '#64748b'
                                                }}>
                                                    {t.orderStatus}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>{formatDate(t.createdAt)}</td>
                                            <td>
                                                <button
                                                    className="btn-admin btn-admin-outline"
                                                    onClick={() => setSelectedTxn(t)}
                                                    style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {pages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        style={{
                                            width: 36, height: 36, borderRadius: '50%', border: 'none',
                                            background: page === p ? '#4338ca' : '#f1f5f9',
                                            color: page === p ? 'white' : '#64748b',
                                            fontWeight: 600, cursor: 'pointer'
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Transaction Detail Modal */}
            {selectedTxn && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem'
                }} onClick={() => setSelectedTxn(null)}>
                    <div style={{
                        background: 'white', borderRadius: 20, width: '100%', maxWidth: 550,
                        maxHeight: '80vh', overflow: 'auto', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem' }}>Transaction Details</h2>
                            <button onClick={() => setSelectedTxn(null)}
                                style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: '1.2rem' }}>
                                ✕
                            </button>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: 16, padding: '1.25rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order ID</span><div style={{ fontWeight: 700, fontFamily: 'monospace' }}>#{selectedTxn.id}</div></div>
                                <div><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Payment ID</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedTxn.paymentId}</div></div>
                                <div><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Customer</span><div style={{ fontWeight: 600 }}>{selectedTxn.userName}</div></div>
                                <div><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Phone</span><div style={{ fontWeight: 600 }}>{selectedTxn.userPhone}</div></div>
                                <div><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Payment Method</span><div>{methodBadge(selectedTxn.paymentMethod)}</div></div>
                                <div><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Payment Status</span><div>{paymentStatusBadge(selectedTxn.paymentStatus)}</div></div>
                                <div><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order Status</span><div style={{ fontWeight: 600 }}>{selectedTxn.orderStatus}</div></div>
                                <div><span style={{ fontSize: '0.8rem', color: '#64748b' }}>Coupon</span><div style={{ fontWeight: 600 }}>{selectedTxn.couponCode}</div></div>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: 16, padding: '1.25rem' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Bill Breakdown</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#64748b' }}>Subtotal</span><span>₹{selectedTxn.subtotal.toFixed(2)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#64748b' }}>Tax</span><span>₹{selectedTxn.tax.toFixed(2)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#64748b' }}>Delivery Fee</span><span>₹{selectedTxn.deliveryFee.toFixed(2)}</span></div>
                            {selectedTxn.discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#10b981' }}><span>Discount</span><span>-₹{selectedTxn.discount.toFixed(2)}</span></div>
                            )}
                            <hr style={{ border: 'none', borderTop: '2px dashed #e2e8f0', margin: '8px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}><span>Total</span><span>₹{selectedTxn.total.toFixed(2)}</span></div>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                            {formatDate(selectedTxn.createdAt)}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
