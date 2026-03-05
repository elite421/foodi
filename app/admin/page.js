'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch('/api/admin/stats').then(r => r.json()).then(setStats);
    }, []);

    const statCards = [
        { icon: '📦', label: "Today's Orders", value: stats?.todaysOrders || 0, color: '#4338ca' },
        { icon: '⏳', label: 'Pending Orders', value: stats?.pendingOrders || 0, color: '#f59e0b' },
        { icon: '👥', label: 'Total Users', value: stats?.users || 0, color: '#10b981' },
        { icon: '📋', label: 'Total Orders', value: stats?.orders || 0, color: '#3b82f6' },
        { icon: '💰', label: 'Monthly Revenue', value: `₹${(stats?.monthlyRevenue || 0).toFixed(0)}`, color: '#8b5cf6' },
        { icon: '🏦', label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toFixed(0)}`, color: '#06b6d4' },
        { icon: '🍽️', label: 'Menu Items', value: stats?.menuItems || 0, color: '#ec4899' },
        { icon: '📂', label: 'Categories', value: stats?.categories || 0, color: '#14b8a6' },
    ];

    const statusColor = (s) => {
        const colors = { PENDING: '#f59e0b', ACCEPTED: '#3b82f6', PREPARING: '#8b5cf6', OUT_FOR_DELIVERY: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444' };
        return colors[s] || '#64748b';
    };

    const formatTime = (d) => {
        const date = new Date(d);
        const now = new Date();
        const diff = (now - date) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    };

    return (
        <>
            <div className="admin-header">
                <h1>📊 Dashboard</h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Welcome back to FooodieClub Admin</p>
            </div>
            <div className="admin-stats">
                {statCards.map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            {stats?.recentOrders?.length > 0 && (
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Recent Orders</h3>
                        <Link href="/admin/orders" style={{ color: '#4338ca', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                            View All →
                        </Link>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map(o => (
                                <tr key={o.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{o.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{o.userName || 'Unknown'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{o.userPhone}</div>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>₹{o.total.toFixed(2)}</td>
                                    <td>
                                        <span style={{
                                            background: o.paymentMethod === 'ONLINE' ? '#dbeafe' : '#fef3c7',
                                            color: o.paymentMethod === 'ONLINE' ? '#2563eb' : '#92400e',
                                            padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem'
                                        }}>
                                            {o.paymentMethod}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{
                                            background: statusColor(o.status) + '20',
                                            color: statusColor(o.status),
                                            padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem'
                                        }}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{formatTime(o.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Quick Actions */}
            <div className="admin-card">
                <h3>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                    {[
                        { href: '/admin/orders', label: 'Manage Orders', icon: '📦', desc: 'View & update orders' },
                        { href: '/admin/menu', label: 'Menu Items', icon: '🍽️', desc: 'Add or edit menu' },
                        { href: '/admin/users', label: 'Users', icon: '👥', desc: 'View all customers' },
                        { href: '/admin/transactions', label: 'Transactions', icon: '💳', desc: 'Payment history' },
                        { href: '/admin/coupons', label: 'Coupons', icon: '🏷️', desc: 'Manage discounts' },
                        { href: '/admin/settings', label: 'Settings', icon: '⚙️', desc: 'Site configuration' },
                    ].map((a, i) => (
                        <Link key={i} href={a.href} style={{
                            padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center',
                            transition: 'all 0.2s', cursor: 'pointer', textDecoration: 'none', color: 'inherit',
                            border: '1px solid #e2e8f0', display: 'block'
                        }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{a.icon}</div>
                            <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>{a.label}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.desc}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
