import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { readData } from '../lib/dataManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Contact Us - FoodiClub', description: 'Get in touch with FoodiClub support.' };

export default async function ContactPage() {
    const data = await readData();
    const s = data.settings || {};
    return (
        <>
            <Navbar settings={data.settings} />
            <main style={{ minHeight: '60vh', padding: '3rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>Contact Us</h1>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '3rem' }}>We would love to hear from you!</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    <div>
                        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '1.5rem' }}>Get in Touch</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {s.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: '1.3rem' }}>📞</span><div><p style={{ fontWeight: 600 }}>Phone</p><p style={{ color: '#64748b', fontSize: '0.9rem' }}>{s.phone}</p></div></div>}
                            {s.email && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: '1.3rem' }}>✉️</span><div><p style={{ fontWeight: 600 }}>Email</p><p style={{ color: '#64748b', fontSize: '0.9rem' }}>{s.email}</p></div></div>}
                            {s.address && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: '1.3rem' }}>📍</span><div><p style={{ fontWeight: 600 }}>Address</p><p style={{ color: '#64748b', fontSize: '0.9rem' }}>{s.address}</p></div></div>}
                        </div>
                    </div>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '1.5rem' }}>Send a Message</h3>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input placeholder="Your Name" style={{ padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.9rem', outline: 'none' }} />
                            <input type="email" placeholder="Your Email" style={{ padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.9rem', outline: 'none' }} />
                            <textarea placeholder="Your Message" rows={4} style={{ padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'Inter' }} />
                            <button type="submit" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #4338ca, #7c3aed)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer settings={data.settings} />
        </>
    );
}
