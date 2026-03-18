import Link from 'next/link';

export const metadata = { title: 'Page Not Found - FooodieClub' };

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', textAlign: 'center', padding: '2rem'
        }}>
            <div style={{
                width: 80, height: 80, background: 'linear-gradient(135deg, #4338ca, #7c3aed)', borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, marginBottom: '1.5rem'
            }}>FC</div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '4rem', fontWeight: 900, color: '#4338ca', margin: 0 }}>404</h1>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, color: '#1e1e2e', margin: '0.5rem 0 1rem' }}>Page Not Found</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 400, lineHeight: 1.6, marginBottom: '2rem' }}>
                Oops! The page you are looking for does not exist or has been moved. Let us take you back to safety.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/" style={{
                    padding: '12px 28px', background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                    color: 'white', borderRadius: 12, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none'
                }}>Go Home</Link>
                <Link href="/menu" style={{
                    padding: '12px 28px', background: 'white', color: '#4338ca', borderRadius: 12,
                    fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', border: '1.5px solid #e2e8f0'
                }}>View Menu</Link>
            </div>
        </div>
    );
}
