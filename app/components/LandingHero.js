'use client';
import { useState } from 'react';

export default function LandingHero({ hero, menuItems, settings, onLocationSet }) {
    const [inputValue, setInputValue] = useState('');
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState('');

    const featuredItems = (menuItems || []).slice(0, 6);
    const s = settings || {};

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
                // Reverse geocode using free API
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();
                    const area = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || '';
                    const city = data.address?.city || data.address?.town || data.address?.state || '';
                    const label = area ? `${area}, ${city}` : city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    onLocationSet({ label, lat: latitude, lng: longitude });
                } catch {
                    onLocationSet({ label: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, lat: latitude, lng: longitude });
                }
                setLocating(false);
            },
            (err) => {
                setLocating(false);
                setError('Unable to get your location. Please enter it manually.');
            },
            { timeout: 10000 }
        );
    };

    const handleOrderNow = () => {
        if (!inputValue.trim()) {
            setError('Please enter your delivery location');
            return;
        }
        onLocationSet({ label: inputValue.trim(), lat: null, lng: null });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleOrderNow();
    };

    return (
        <div className="landing-page">
            {/* Decorative lights */}
            <div className="landing-lights">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="light-bulb" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
            </div>

            <div className="landing-container">
                {/* Left Section */}
                <div className="landing-left">
                    <div className="landing-logo-area">
                        <div className="logo-icon" style={{ width: 48, height: 48, fontSize: 16 }}>FC</div>
                        <div>
                            <div className="logo-text" style={{ fontSize: '1.4rem' }}>{s.siteName || 'FooodieClub'}</div>
                            <div className="logo-tagline">{s.tagline || 'Foodcourt on an App'}</div>
                        </div>
                    </div>

                    <h1 className="landing-title">
                        {hero?.title || 'Welcome to FooodieClub!'}
                    </h1>
                    <p className="landing-subtitle">
                        {hero?.subtitle || 'Delicious food, delivered to your doorstep.'}{' '}
                        {hero?.promoText || ''}
                    </p>

                    <div className="landing-search-wrapper">
                        <div className={`landing-search ${error ? 'landing-search-error' : ''}`}>
                            <div className="landing-search-icon">📍</div>
                            <input
                                type="text"
                                placeholder={hero?.searchPlaceholder || 'Enter your delivery location'}
                                value={inputValue}
                                onChange={(e) => { setInputValue(e.target.value); setError(''); }}
                                onKeyDown={handleKeyDown}
                                id="location-input"
                            />
                            <button
                                className="btn-locate"
                                onClick={handleLocateMe}
                                disabled={locating}
                            >
                                <span>{locating ? '⏳' : '◎'}</span>
                                {locating ? 'Locating...' : 'Locate Me'}
                            </button>
                            <button className="btn-order" onClick={handleOrderNow}>
                                Order Now
                            </button>
                        </div>
                        {error && <div className="landing-error">{error}</div>}
                    </div>
                </div>

                {/* Right Section */}
                <div className="landing-right">
                    <div className="landing-offer-area">
                        <div className="landing-offer-badge">
                            {hero?.bannerOffer?.title || 'BUY 1 GET 1'}
                        </div>
                        <div className="landing-offer-free">
                            {hero?.bannerOffer?.highlight || 'FREE'}
                        </div>
                        <div className="landing-offer-subtitle">
                            {hero?.bannerOffer?.subtitle || 'ALL DAY, EVERYDAY'}
                        </div>
                    </div>

                    <div className="landing-brands">
                        {featuredItems.slice(0, 2).map((r) => (
                            <div key={r.id} className="landing-brand-card landing-brand-large">
                                <img src={r.image} alt={r.name} loading="lazy" />
                                <div className="landing-brand-name">{r.name}</div>
                            </div>
                        ))}
                    </div>
                    <div className="landing-brands" style={{ marginTop: 12 }}>
                        {featuredItems.slice(2, 5).map((r) => (
                            <div key={r.id} className="landing-brand-card">
                                <img src={r.image} alt={r.name} loading="lazy" />
                                <div className="landing-brand-name">{r.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className="landing-tc">
                        <span>*T&C Apply</span>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            {hero?.stats && (
                <div className="hero-stats">
                    <span>⭐ {hero.stats.rating}</span>
                    <span>•</span>
                    <span>📥 {hero.stats.downloads}</span>
                    <span>•</span>
                    <span>🏙️ {hero.stats.cities}</span>
                </div>
            )}
        </div>
    );
}
