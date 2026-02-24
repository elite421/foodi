'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import RealtimeNotification from './RealtimeNotification';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/transactions', label: 'Transactions', icon: '💳' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/menu', label: 'Menu', icon: '🍽️' },
    { href: '/admin/categories', label: 'Categories', icon: '📂' },
    { href: '/admin/brands', label: 'Brands', icon: '🏢' },
    { href: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
    { href: '/admin/offers', label: 'Offers', icon: '🎁' },
    // { href: '/admin/hero', label: 'Hero Section', icon: '🏠' },
    { href: '/admin/collections', label: 'Collections', icon: '📚' },
    { href: '/admin/elite', label: 'Elite', icon: '👑' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    // { href: '/admin/pages', label: 'Pages', icon: '📄' },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [admin, setAdmin] = useState(null);
    const [checking, setChecking] = useState(true);

    // Skip auth check for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) { setChecking(false); return; }
        fetch('/api/auth/me').then(r => r.json()).then(data => {
            if (data.authenticated) { setAdmin(data.admin); setChecking(false); }
            else { router.replace('/admin/login'); }
        }).catch(() => router.replace('/admin/login'));
    }, [pathname, isLoginPage, router]);

    if (isLoginPage) return <>{children}</>;

    if (checking) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="logo-icon" style={{ width: 64, height: 64, fontSize: 22, margin: '0 auto 12px' }}>FC</div>
                    <p style={{ color: '#64748b' }}>Loading admin panel...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.replace('/admin/login');
    };

    return (
        <div className="admin-layout">
            {admin && <RealtimeNotification />}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    <h2>Foodi<span>Club</span></h2>
                    <p>Admin Panel</p>
                </div>
                <nav className="admin-nav">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href}>
                            <div className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}>
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </nav>
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem' }}>
                    {admin && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: 8 }}>👤 {admin.name}</p>}
                    <Link href="/">
                        <div className="admin-nav-item" style={{ borderLeft: 'none' }}>
                            <span className="nav-icon">🌐</span> View Website
                        </div>
                    </Link>
                    <button onClick={handleLogout} className="admin-nav-item" style={{ borderLeft: 'none', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#ef4444' }}>
                        <span className="nav-icon">🚪</span> Logout
                    </button>
                </div>
            </aside>
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
