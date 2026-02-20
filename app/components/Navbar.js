'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import SearchModal from './SearchModal';
import { useCart } from './CartContext';

export default function Navbar({ settings, location, onClearLocation, onSetLocation }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [locating, setLocating] = useState(false);
    const [locationDropdown, setLocationDropdown] = useState(false);
    const { cartCount } = useCart();

    const s = settings || { siteName: 'FoodiClub', tagline: 'Your favorite restaurant' };

    useEffect(() => {
        fetch('/api/auth/user/me')
            .then(res => res.json())
            .then(data => { if (data.authenticated) setUser(data.user); })
            .catch(() => { });
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/user/logout', { method: 'POST' });
        setUser(null);
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();
                    const area = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || '';
                    const city = data.address?.city || data.address?.town || data.address?.state || '';
                    const label = area ? `${area}, ${city}` : city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    if (onSetLocation) onSetLocation({ label, lat: latitude, lng: longitude });
                } catch {
                    if (onSetLocation) onSetLocation({ label: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, lat: latitude, lng: longitude });
                }
                setLocating(false);
                setLocationDropdown(false);
            },
            () => {
                setLocating(false);
                alert('Unable to get your location. Please allow location access.');
            },
            { timeout: 10000 }
        );
    };

    return (
        <>
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLoginSuccess={(u) => { setUser(u); setAuthOpen(false); }} />
            {searchOpen && <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
            <nav className="navbar" id="navbar">
                <div className="navbar-inner">
                    <div className="navbar-left">
                        <Link href="/" className="logo">
                            <div className="logo-icon">FC</div>
                            <div>
                                <div className="logo-text">{s.siteName}</div>
                                <div className="logo-tagline">{s.tagline}</div>
                            </div>
                        </Link>

                        {/* Location section */}
                        <div style={{ position: 'relative' }}>
                            {location ? (
                                <button className="location-badge" onClick={() => setLocationDropdown(!locationDropdown)} title="Change location">
                                    <span>📍</span>
                                    <span className="location-label">{location.label}</span>
                                    <span className="location-change" style={{ fontSize: '0.65rem', opacity: 0.6 }}>▼</span>
                                </button>
                            ) : (
                                <button
                                    className="location-badge"
                                    onClick={handleDetectLocation}
                                    disabled={locating}
                                    style={{ cursor: locating ? 'wait' : 'pointer' }}
                                >
                                    <span>{locating ? '⏳' : '📍'}</span>
                                    <span className="location-label">{locating ? 'Detecting...' : 'Set Location'}</span>
                                </button>
                            )}

                            {/* Location dropdown */}
                            {locationDropdown && location && (
                                <div style={{
                                    position: 'absolute', top: '100%', left: 0, marginTop: 8,
                                    background: 'white', borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                    padding: '0.75rem', minWidth: 220, zIndex: 100,
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#64748b', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
                                        📍 {location.label}
                                    </div>
                                    <button
                                        onClick={() => { handleDetectLocation(); }}
                                        style={{
                                            width: '100%', padding: '10px 12px', border: 'none', background: 'none',
                                            textAlign: 'left', cursor: 'pointer', borderRadius: 8, fontSize: '0.85rem',
                                            fontWeight: 600, color: '#4338ca', display: 'flex', alignItems: 'center', gap: 8
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                                    >
                                        ◎ Detect My Location
                                    </button>
                                    <button
                                        onClick={() => { if (onClearLocation) onClearLocation(); setLocationDropdown(false); }}
                                        style={{
                                            width: '100%', padding: '10px 12px', border: 'none', background: 'none',
                                            textAlign: 'left', cursor: 'pointer', borderRadius: 8, fontSize: '0.85rem',
                                            fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                                    >
                                        ✕ Clear Location
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`navbar-right ${mobileOpen ? 'open' : ''}`}>
                        <span className="nav-phone">📞 {s.phone || '1800-123-4567'}</span>
                        <Link href="/menu" className="nav-link">Menu</Link>
                        <Link href="/about" className="nav-link">About</Link>
                        <Link href="/contact" className="nav-link">Contact</Link>
                        <button className="nav-icon-btn" title="Search" onClick={() => setSearchOpen(true)}>🔍 Search</button>
                        <Link href="/checkout" className="nav-icon-btn" title="Cart" style={{ position: 'relative' }}>
                            🛒 Cart
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -5, right: -5,
                                    background: '#ef4444', color: 'white', borderRadius: '50%',
                                    width: 18, height: 18, fontSize: '10px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Link href="/account" className="btn-signin" style={{ textDecoration: 'none', display: 'inline-block', background: '#f8fafc', color: '#0f172a' }}>
                                    👤 {user.name.split(' ')[0]}
                                </Link>
                                <button onClick={handleLogout} className="nav-icon-btn" style={{ marginLeft: 8, color: '#ef4444' }}>Logout</button>
                            </div>
                        ) : (
                            <button className="btn-signin" onClick={() => setAuthOpen(true)}>Sign In</button>
                        )}
                    </div>
                    <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>
        </>
    );
}
