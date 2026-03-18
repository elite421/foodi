import { verifyUserSession } from '@/app/lib/auth';
import Navbar from '@/app/components/Navbar';
import { getAllSiteData } from '@/app/lib/db';
import DashboardClient from './DashboardClient';

export const metadata = { title: 'My Dashboard | FooodieClub' };
export const dynamic = 'force-dynamic';

export default async function AccountDashboard() {
    const user = await verifyUserSession();
    if (!user) {
        return (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', background: '#f8fafc', minHeight: '100vh' }}>
                <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1rem' }}>Unauthorized</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Please sign in to view your account.</p>
                <a href="/" style={{ padding: '12px 24px', background: '#4338ca', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                    Go to Home
                </a>
            </div>
        );
    }

    const data = await getAllSiteData();

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar settings={data.settings} />
            <DashboardClient user={user} />
        </div>
    );
}
