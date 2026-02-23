'use client';
import { useState } from 'react';
import { reverseGeocode } from '../lib/geocode';

export default function LocationGate({ settings, menuItems, onLocationSet }) {
    const [inputValue, setInputValue] = useState('');
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState('');

    const s = settings || {};
    const featuredItems = (menuItems || []).slice(0, 5);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }
        setLocating(true);
        setError('');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const loc = await reverseGeocode(latitude, longitude);
                onLocationSet(loc);
                setLocating(false);
            },
            () => {
                setLocating(false);
                setError('Unable to get your location. Please enter it manually.');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const handleManualSubmit = () => {
        if (!inputValue.trim()) {
            setError('Please enter your delivery location');
            return;
        }
        onLocationSet({ label: inputValue.trim(), lat: null, lng: null });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleManualSubmit();
    };

    return (
        <div className="loc-gate">
            {/* Animated background blobs */}
            <div className="loc-gate-bg">
                <div className="loc-blob loc-blob-1" />
                <div className="loc-blob loc-blob-2" />
                <div className="loc-blob loc-blob-3" />
            </div>

            <div className="loc-gate-content">
                {/* Logo */}
                <div className="loc-gate-logo">
                    <div className="logo-icon" style={{ width: 56, height: 56, fontSize: 18 }}>FC</div>
                    <div>
                        <div className="logo-text" style={{ fontSize: '1.6rem' }}>{s.siteName || 'FooodieClub'}</div>
                        <div className="logo-tagline" style={{ fontSize: '0.75rem' }}>{s.tagline || 'Foodcourt on an App'}</div>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="loc-gate-title">
                    Hungry? We&apos;ve got you <span>covered</span>
                </h1>
                <p className="loc-gate-subtitle">
                    Set your location to explore our menu and get delicious food delivered right to your door.
                </p>

                {/* GPS Button */}
                <button
                    className="loc-gate-gps-btn"
                    onClick={handleLocateMe}
                    disabled={locating}
                    id="detect-location-btn"
                >
                    <span className="loc-gate-gps-icon">{locating ? '⏳' : '📍'}</span>
                    {locating ? 'Detecting your location...' : 'Use My Current Location'}
                </button>

                {/* Divider */}
                <div className="loc-gate-divider">
                    <span>or enter manually</span>
                </div>

                {/* Manual Input */}
                <div className="loc-gate-input-wrap">
                    <input
                        type="text"
                        className={`loc-gate-input ${error ? 'loc-gate-input-error' : ''}`}
                        placeholder="Enter your area, city, or address..."
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); setError(''); }}
                        onKeyDown={handleKeyDown}
                        id="manual-location-input"
                    />
                    <button
                        className="loc-gate-submit-btn"
                        onClick={handleManualSubmit}
                        id="submit-location-btn"
                    >
                        →
                    </button>
                </div>
                {error && <div className="loc-gate-error">{error}</div>}

                {/* Brands Preview */}
                <div className="loc-gate-preview" style={{ marginTop: '2rem' }}>
                    <p className="loc-gate-preview-label">🌟 Our Partner Brands</p>
                    <div className="loc-gate-preview-items" style={{ gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[
                            { id: 1, name: 'The Royal Biryani', image: '/logos/the royal biryani final.png' },
                            { id: 2, name: 'Authentic Bowls', image: '/logos/authentic bowls final.png' },
                            { id: 3, name: 'Wapi', image: '/logos/wapi final.png' },
                            { id: 4, name: 'The Lunch Box', image: '/logos/the lunch box final.png' }
                        ].map(brand => (
                            <div key={brand.id} style={{
                                width: '70px',
                                height: '70px',
                                background: 'white',
                                borderRadius: '12px',
                                padding: '8px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img src={brand.image} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 0 }} loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* App Coming Soon Banner */}
            <div className="loc-gate-app-banner" id="app-coming-soon-banner">
                <div className="loc-gate-app-banner-inner">
                    <div className="loc-gate-app-banner-icon">📱</div>
                    <div className="loc-gate-app-banner-text">
                        <strong>FooodieClub App is Coming Soon!</strong>
                        <span>Get exclusive discounts &amp; faster ordering on the go.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
