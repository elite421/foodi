import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { readData } from '../lib/dataManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About Us - FoodiClub', description: 'Learn about FoodiClub, India\'s favourite food delivery platform.' };

export default async function AboutPage() {
    const data = await readData();
    const cards = [
        { icon: '🎯', title: 'Our Mission', desc: 'To deliver delicious food from the best restaurants straight to your doorstep, making every meal a celebration.' },
        { icon: '👥', title: 'Our Team', desc: 'A passionate team of food lovers and tech enthusiasts working to make food ordering seamless and delightful.' },
        { icon: '🌍', title: 'Our Reach', desc: 'Available in 50+ cities across India with thousands of restaurant partners and millions of happy customers.' },
        { icon: '💎', title: 'Our Promise', desc: 'Quality food, fast delivery, and the best offers — that\'s the FoodiClub promise to every customer.' },
    ];
    return (
        <>
            <Navbar settings={data.settings} />
            <main style={{ minHeight: '60vh', padding: '3rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>About <span style={{ color: '#4338ca' }}>FoodiClub</span></h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
                        {data.settings?.tagline || 'Foodcourt on an App'} — We bring the best restaurants to you in a single order experience.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    {cards.map((c, i) => (
                        <div key={i} style={{ padding: '2rem', background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', border: '1px solid #f1f5f9', transition: 'transform 0.2s' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{c.icon}</div>
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 8 }}>{c.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{c.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer settings={data.settings} />
        </>
    );
}
