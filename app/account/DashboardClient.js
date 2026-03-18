'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ user: initialUser }) {
    const [user, setUser] = useState(initialUser);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, favorites: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const router = useRouter();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, addressesRes] = await Promise.all([
                fetch('/api/user/orders?limit=5'),
                fetch('/api/user/addresses')
            ]);
            
            const ordersData = await ordersRes.json();
            const addressesData = await addressesRes.json();
            
            if (ordersData.orders) {
                setOrders(ordersData.orders);
                const totalSpent = ordersData.orders.reduce((sum, o) => sum + (o.total || 0), 0);
                setStats(prev => ({ ...prev, totalOrders: ordersData.total || ordersData.orders.length, totalSpent }));
            }
            
            if (addressesData.addresses) {
                setAddresses(addressesData.addresses);
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        document.cookie = 'fc_user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        window.location.href = '/';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED': return '✅';
            case 'CANCELLED': return '❌';
            case 'OUT_FOR_DELIVERY': return '🚚';
            case 'PREPARING': return '👨‍🍳';
            case 'CONFIRMED': return '📋';
            default: return '⏳';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return '#10b981';
            case 'CANCELLED': return '#ef4444';
            case 'OUT_FOR_DELIVERY': return '#8b5cf6';
            case 'PREPARING': return '#f59e0b';
            case 'CONFIRMED': return '#3b82f6';
            default: return '#64748b';
        }
    };

    const QuickActionCard = ({ icon, title, description, href, color }) => (
        <Link href={href} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: 20,
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'all 0.3s ease',
            border: '1px solid transparent',
            cursor: 'pointer'
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = color;
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
            e.currentTarget.style.borderColor = 'transparent';
        }}>
            <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${color}, ${color}80)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{title}</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>{description}</p>
            </div>
        </Link>
    );

    const StatCard = ({ icon, value, label, color }) => (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: 20,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <div style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{label}</div>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Welcome Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a', fontFamily: 'Outfit' }}>
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: '#64748b', margin: '0.5rem 0 0 0', fontSize: '1rem' }}>
                    Here's what's happening with your account today.
                </p>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <StatCard icon="🛍️" value={stats.totalOrders} label="Total Orders" color="#4338ca" />
                <StatCard icon="💰" value={`₹${stats.totalSpent.toFixed(0)}`} label="Total Spent" color="#10b981" />
                <StatCard icon="📍" value={addresses.length} label="Saved Addresses" color="#f59e0b" />
                <StatCard icon="🎯" value={stats.favorites || 0} label="Favorites" color="#ec4899" />
            </div>

            {/* Quick Actions Grid */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                <QuickActionCard 
                    icon="🛍️" 
                    title="My Orders" 
                    description="View order history & track deliveries"
                    href="/account/orders"
                    color="#4338ca"
                />
                <QuickActionCard 
                    icon="📍" 
                    title="My Addresses" 
                    description="Manage delivery locations"
                    href="/account/addresses"
                    color="#10b981"
                />
                <QuickActionCard 
                    icon="🍽️" 
                    title="Browse Menu" 
                    description="Explore our delicious offerings"
                    href="/menu"
                    color="#f59e0b"
                />
                <QuickActionCard 
                    icon="🛒" 
                    title="Go to Cart" 
                    description="View and manage your cart"
                    href="/cart"
                    color="#ec4899"
                />
            </div>

            {/* Recent Orders Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Orders */}
                <div style={{ background: 'white', borderRadius: 24, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Recent Orders</h2>
                        <Link href="/account/orders" style={{ color: '#4338ca', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                            View All →
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading...</div>
                    ) : orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
                            <p>No orders yet. Start ordering!</p>
                            <Link href="/menu" style={{
                                display: 'inline-block',
                                marginTop: '1rem',
                                padding: '10px 20px',
                                background: '#4338ca',
                                color: 'white',
                                borderRadius: 12,
                                textDecoration: 'none',
                                fontWeight: 600
                            }}>
                                Browse Menu
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {orders.slice(0, 3).map(order => (
                                <Link key={order.id} href={`/account/orders/${order.id}`} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: 16,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'background 0.2s'
                                }} onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                                    <div style={{ fontSize: '1.5rem' }}>{getStatusIcon(order.status)}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>Order #{order.id.slice(-6)}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{order.total?.toFixed(2)}</div>
                                        <div style={{ fontSize: '0.8rem', color: getStatusColor(order.status), fontWeight: 600 }}>
                                            {order.status}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Saved Addresses */}
                <div style={{ background: 'white', borderRadius: 24, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Saved Addresses</h2>
                        <Link href="/account/addresses" style={{ color: '#4338ca', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                            Manage →
                        </Link>
                    </div>
                    
                    {addresses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                            <p>No addresses saved yet.</p>
                            <Link href="/account/addresses" style={{
                                display: 'inline-block',
                                marginTop: '1rem',
                                padding: '10px 20px',
                                background: '#10b981',
                                color: 'white',
                                borderRadius: 12,
                                textDecoration: 'none',
                                fontWeight: 600
                            }}>
                                Add Address
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {addresses.slice(0, 2).map(address => (
                                <div key={address.id} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: 16
                                }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 12,
                                        background: '#4338ca20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem'
                                    }}>
                                        🏠
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{address.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>
                                            {address.street}, {address.city}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Quick Order Again */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.75rem 0', color: '#0f172a' }}>Hungry?</h3>
                        <Link href="/menu" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                            color: 'white',
                            borderRadius: 12,
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'transform 0.2s'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <span>🍽️</span>
                            Order Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div style={{ marginTop: '2.5rem', background: 'white', borderRadius: 24, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#0f172a' }}>Account</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 16 }}>
                        <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 4 }}>Full Name</div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.name}</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 16 }}>
                        <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 4 }}>Phone Number</div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.phone}</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 16 }}>
                        <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 4 }}>Email Address</div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.email || 'Not provided'}</div>
                    </div>
                </div>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={handleLogout} style={{
                        padding: '12px 24px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fecaca';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                    }}>
                        🚪 Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
