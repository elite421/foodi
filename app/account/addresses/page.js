import { verifyUserSession } from '@/app/lib/auth';
import Navbar from '@/app/components/Navbar';
import { getAllSiteData } from '@/app/lib/db';
import AddressesClient from './AddressesClient';

export default async function UserAddresses() {
    const user = await verifyUserSession();
    if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please sign in.</div>;
    const data = await getAllSiteData();

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar settings={data.settings} />
            <AddressesClient />
        </div>
    );
}
