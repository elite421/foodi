import { verifyUserSession } from '@/app/lib/auth';
import Navbar from '@/app/components/Navbar';
import { getAllSiteData } from '@/app/lib/db';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default async function AccountDashboard() {
    const user = await verifyUserSession();
    if (!user) {
        return (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', background: '#f8fafc', minHeight: '100vh' }}>
                <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1rem' }}>Unauthorized</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Please sign in to view your account.</p>
                <Link href="/" style={{ padding: '12px 24px', background: '#4338ca', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                    Go to Home
                </Link>
            </div>
        );
    }

    const data = await getAllSiteData();

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar settings={data.settings} />
            <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', fontFamily: 'Outfit' }}>My Account</h1>

                <div style={{ background: 'white', padding: '2rem', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Profile Details</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 4 }}>Full Name</div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user.name}</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 4 }}>Phone Number</div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user.phone}</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 4 }}>Email Address</div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user.email || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <Link href="/account/orders" style={{
                        background: 'white', padding: '2rem', borderRadius: 24, textDecoration: 'none', color: 'inherit',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}>My Orders</h3>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', textAlign: 'center', marginTop: '0.5rem' }}>View your past orders, track status, and get invoices.</p>
                    </Link>

                    <Link href="/account/addresses" style={{
                        background: 'white', padding: '2rem', borderRadius: 24, textDecoration: 'none', color: 'inherit',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}>My Addresses</h3>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', textAlign: 'center', marginTop: '0.5rem' }}>Manage your delivery locations for faster checkout.</p>
                    </Link>
                </div>

                <div style={{ marginTop: '3rem', textAlign: 'center', paddingBottom: '3rem' }}>
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}
