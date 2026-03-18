'use client';
import { useState, useEffect } from 'react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async (p = 1, q = '') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?page=${p}&search=${encodeURIComponent(q)}`);
            const data = await res.json();
            setUsers(data.users || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers(1, search);
    };

    const handlePageChange = (p) => {
        setPage(p);
        fetchUsers(p, search);
    };

    const viewUser = async (userId) => {
        setSelectedUser(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`);
            const data = await res.json();
            setUserDetail(data.user);
        } catch (e) { console.error(e); }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const statusColor = (s) => {
        const colors = { PENDING: '#f59e0b', ACCEPTED: '#3b82f6', PREPARING: '#8b5cf6', OUT_FOR_DELIVERY: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444' };
        return colors[s] || '#64748b';
    };

    return (
        <>
            <div className="admin-header">
                <h1>👥 Users</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 14px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>
                        {total} total
                    </span>
                </div>
            </div>

            <div className="admin-card">
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="Search by name, email, phone, or ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                    />
                    <button type="submit" className="btn-admin btn-admin-primary">Search</button>
                </form>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading users...</div>
                ) : users.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No users found</div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Phone</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                                        </td>
                                        <td>{u.phone}</td>
                                        <td>
                                            <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.85rem' }}>
                                                {u.orderCount}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 700, color: '#10b981' }}>₹{u.totalSpent.toFixed(2)}</td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{formatDate(u.createdAt)}</td>
                                        <td>
                                            <button
                                                className="btn-admin btn-admin-outline"
                                                onClick={() => viewUser(u.id)}
                                                style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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

            {/* User Detail Modal */}
            {selectedUser && userDetail && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem'
                }} onClick={() => { setSelectedUser(null); setUserDetail(null); }}>
                    <div style={{
                        background: 'white', borderRadius: 20, width: '100%', maxWidth: 700,
                        maxHeight: '85vh', overflow: 'auto', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem' }}>User Details</h2>
                            <button onClick={() => { setSelectedUser(null); setUserDetail(null); }}
                                style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: '1.2rem' }}>
                                ✕
                            </button>
                        </div>

                        {/* User Info Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #4338ca, #7c3aed)', borderRadius: 16,
                            padding: '1.5rem', color: 'white', marginBottom: '1.5rem'
                        }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>{userDetail.name}</div>
                            <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>📧 {userDetail.email}</div>
                            <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>📱 {userDetail.phone}</div>
                            <div style={{ opacity: 0.7, fontSize: '0.8rem', marginTop: 8 }}>ID: {userDetail.id} • Joined: {formatDate(userDetail.createdAt)}</div>
                        </div>

                        {/* Addresses */}
                        <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>📍 Addresses ({userDetail.addresses?.length || 0})</h3>
                        {userDetail.addresses?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {userDetail.addresses.map(a => (
                                    <div key={a.id} style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                        <strong>{a.label}</strong>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{a.street}, {a.city}, {a.state} {a.zip}</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>No addresses saved</p>}

                        {/* Orders */}
                        <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>📦 Orders ({userDetail.orders?.length || 0})</h3>
                        {userDetail.orders?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {userDetail.orders.map(o => (
                                    <div key={o.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>#{o.id}</span>
                                            <span style={{ background: statusColor(o.status) + '20', color: statusColor(o.status), padding: '2px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem' }}>
                                                {o.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                                            <span>₹{o.total.toFixed(2)}</span>
                                            <span>{o.paymentMethod}</span>
                                            <span>{o.items?.length || 0} items</span>
                                            <span>{formatDate(o.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No orders yet</p>}
                    </div>
                </div>
            )}
        </>
    );
}
