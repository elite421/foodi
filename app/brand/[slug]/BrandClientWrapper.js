'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MenuSection from '../../components/MenuSection';
import LocationGate from '../../components/LocationGate';

export default function BrandClientWrapper({ brand, categories, menuItems, settings }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [deliveryAvailable, setDeliveryAvailable] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('fc_location');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLocation(parsed);
                if (parsed.lat && parsed.lng) {
                    checkDelivery(parsed.lat, parsed.lng);
                }
            } catch { }
        }
        setLocationLoading(false);
    }, []);

    const checkDelivery = (lat, lng) => {
        const rLat = settings.restaurantLat || 0;
        const rLng = settings.restaurantLng || 0;
        const radius = settings.deliveryRadius || 10;

        if (!rLat && !rLng) {
            setDeliveryAvailable(true);
            return;
        }

        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat - rLat);
        const dLon = toRad(lng - rLng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(rLat)) * Math.cos(toRad(lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        setDeliveryAvailable(distance <= radius);
    };

    const handleLocationSet = (loc) => {
        setLocation(loc);
        localStorage.setItem('fc_location', JSON.stringify(loc));
        if (loc.lat && loc.lng) checkDelivery(loc.lat, loc.lng);
        else setDeliveryAvailable(null);
    };

    const handleClearLocation = () => {
        setLocation(null);
        setDeliveryAvailable(null);
        localStorage.removeItem('fc_location');
    };

    if (locationLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-logo">
                    <div className="logo-icon" style={{ width: 64, height: 64, fontSize: 22 }}>FC</div>
                </div>
            </div>
        );
    }

    if (!location) {
        return <LocationGate settings={settings} menuItems={menuItems} onLocationSet={handleLocationSet} />;
    }

    return (
        <>
            <Navbar settings={settings} location={location} onClearLocation={handleClearLocation} onSetLocation={handleLocationSet} deliveryAvailable={deliveryAvailable} />

            {deliveryAvailable === false && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    padding: '12px 2rem', textAlign: 'center', fontSize: '0.9rem',
                    fontWeight: 600, color: '#92400e', position: 'sticky',
                    top: 64, zIndex: 40, borderBottom: '1px solid #fbbf24'
                }}>
                    ⚠️ Your location is outside our delivery area. You can still browse the menu but delivery is not available.
                </div>
            )}

            <main style={{ minHeight: '60vh' }}>
                <section style={{ padding: '3rem 2rem', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    {brand.image && <img src={brand.image} alt={brand.name} style={{ width: '150px', height: '150px', objectFit: 'contain', margin: '0 auto 1.5rem' }} />}
                    <h1 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>{brand.name}</h1>
                    {brand.description && <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>{brand.description}</p>}
                </section>

                {menuItems.length > 0 ? (
                    <MenuSection menuItems={menuItems} categories={categories} deliveryAvailable={deliveryAvailable} />
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b', fontSize: '1.2rem' }}>
                        No items found for this brand yet.
                    </div>
                )}
            </main>
            <Footer settings={settings} />
        </>
    );
}
