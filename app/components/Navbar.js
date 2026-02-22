'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';
import SearchModal from './SearchModal';
import { useCart } from './CartContext';
import { reverseGeocode } from '../lib/geocode';

export default function Navbar({ settings, location, onClearLocation, onSetLocation, deliveryAvailable }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [locating, setLocating] = useState(false);
    const [locationDropdown, setLocationDropdown] = useState(false);
    const [editAddress, setEditAddress] = useState('');
    const [editError, setEditError] = useState('');
    const dropdownRef = useRef(null);
    const { cartCount } = useCart();

    const s = settings || { siteName: 'FooodieClub', tagline: 'Your favorite restaurant' };

    useEffect(() => {
        fetch('/api/auth/user/me')
            .then(res => res.json())
            .then(data => { if (data.authenticated) setUser(data.user); })
            .catch(() => { });
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setLocationDropdown(false);
                setEditError('');
            }
        };
        if (locationDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [locationDropdown]);

    // Pre-fill the edit field when dropdown opens
    useEffect(() => {
        if (locationDropdown && location) {
            setEditAddress(location.label || '');
            setEditError('');
        }
    }, [locationDropdown, location]);

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
                const loc = await reverseGeocode(latitude, longitude);
                if (onSetLocation) onSetLocation(loc);
                setLocating(false);
                setLocationDropdown(false);
            },
            () => {
                setLocating(false);
                alert('Unable to get your location. Please allow location access.');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const handleManualUpdate = () => {
        const trimmed = editAddress.trim();
        if (!trimmed) {
            setEditError('Please enter a valid address');
            return;
        }
        if (onSetLocation) onSetLocation({ label: trimmed, lat: null, lng: null });
        setLocationDropdown(false);
        setEditError('');
    };

    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter') handleManualUpdate();
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
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            {location ? (
                                <button className="location-badge" onClick={() => setLocationDropdown(!locationDropdown)} title="Change location" id="location-badge-btn">
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

                            {/* Location dropdown with edit */}
                            {locationDropdown && location && (
                                <div className="loc-dropdown" id="location-dropdown">
                                    {/* Current location display */}
                                    <div className="loc-dropdown-current">
                                        <span className="loc-dropdown-current-icon">📍</span>
                                        <span className="loc-dropdown-current-text">{location.label}</span>
                                    </div>

                                    {/* Editable address input */}
                                    <div className="loc-dropdown-edit">
                                        <label className="loc-dropdown-label">Change delivery address</label>
                                        <div className="loc-dropdown-input-row">
                                            <input
                                                type="text"
                                                className="loc-dropdown-input"
                                                value={editAddress}
                                                onChange={(e) => { setEditAddress(e.target.value); setEditError(''); }}
                                                onKeyDown={handleEditKeyDown}
                                                placeholder="Enter new address..."
                                                id="edit-location-input"
                                                autoFocus
                                            />
                                            <button
                                                className="loc-dropdown-save-btn"
                                                onClick={handleManualUpdate}
                                                id="save-location-btn"
                                                title="Save address"
                                            >
                                                ✓
                                            </button>
                                        </div>
                                        {editError && <div className="loc-dropdown-error">{editError}</div>}
                                    </div>

                                    {/* Divider */}
                                    <div className="loc-dropdown-divider" />

                                    {/* Quick actions */}
                                    <button
                                        className="loc-dropdown-action"
                                        onClick={handleDetectLocation}
                                        disabled={locating}
                                        id="detect-location-dropdown-btn"
                                    >
                                        <span>{locating ? '⏳' : '◎'}</span>
                                        {locating ? 'Detecting...' : 'Use GPS Location'}
                                    </button>
                                    <button
                                        className="loc-dropdown-action loc-dropdown-action-danger"
                                        onClick={() => { if (onClearLocation) onClearLocation(); setLocationDropdown(false); }}
                                        id="clear-location-btn"
                                    >
                                        <span>✕</span>
                                        Clear Location
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
                        {deliveryAvailable === false ? (
                            <button
                                className="nav-icon-btn"
                                title="Delivery not available at your location"
                                style={{ position: 'relative', opacity: 0.5, cursor: 'not-allowed' }}
                                onClick={() => alert('Delivery is not available at your location. Please change your address to place an order.')}
                            >
                                🛒 Cart
                                {cartCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: -5, right: -5,
                                        background: '#94a3b8', color: 'white', borderRadius: '50%',
                                        width: 18, height: 18, fontSize: '10px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                    }}>
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        ) : (
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
                        )}
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
