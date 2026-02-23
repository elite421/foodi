'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import OfferCarousel from './OfferCarousel';
import CategoriesSection from './CategoriesSection';
import MenuSection from './MenuSection';
import FoodCategoriesCarousel from './FoodCategoriesCarousel';
import CollectionsSection from './CollectionsSection';
import EliteSection from './EliteSection';
import BrandsSection from './BrandsSection';
import Footer from './Footer';
import LocationGate from './LocationGate';

export default function HomeWrapper({ data }) {
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
        const settings = data.settings || {};
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
        if (loc.lat && loc.lng) {
            checkDelivery(loc.lat, loc.lng);
        } else {
            setDeliveryAvailable(null);
        }
    };

    const handleClearLocation = () => {
        setLocation(null);
        setDeliveryAvailable(null);
        localStorage.removeItem('fc_location');
    };

    // Loading state
    if (locationLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-logo">
                    <div className="logo-icon" style={{ width: 64, height: 64, fontSize: 22 }}>FC</div>
                    <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#4338ca', marginTop: 12 }}>
                        FooodieClub
                    </div>
                </div>
            </div>
        );
    }

    // No location set → show location gate
    if (!location) {
        return (
            <LocationGate
                settings={data.settings}
                menuItems={data.menuItems}
                onLocationSet={handleLocationSet}
            />
        );
    }

    // Location set → show main website
    return (
        <>
            <Navbar settings={data.settings} location={location} onClearLocation={handleClearLocation} onSetLocation={handleLocationSet} deliveryAvailable={deliveryAvailable} />

            {/* Delivery area banner */}
            {deliveryAvailable === false && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    padding: '12px 2rem',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#92400e',
                    position: 'sticky',
                    top: 64,
                    zIndex: 40,
                    borderBottom: '1px solid #fbbf24'
                }}>
                    ⚠️ Your location is outside our delivery area. You can still browse the menu but delivery is not available.
                </div>
            )}

            <main>
                <OfferCarousel offers={data.offers} />
                <BrandsSection brands={data.brands} />
                <CategoriesSection categories={data.categories} />
                <MenuSection menuItems={data.menuItems} categories={data.categories} deliveryAvailable={deliveryAvailable} />
                <FoodCategoriesCarousel categories={data.categories} />
                <CollectionsSection collections={data.collections} />
                <EliteSection elite={data.elite} />
            </main>

            {/* App Coming Soon Footer Banner */}
            <div className="app-coming-soon-banner" id="app-coming-soon-home">
                <div className="app-coming-soon-inner">
                    <div className="app-coming-soon-icon">📱</div>
                    <div className="app-coming-soon-text">
                        <strong>FooodieClub App is Coming Soon!</strong>
                        <span>Download the app for exclusive deals, faster checkout &amp; real-time order tracking.</span>
                    </div>
                </div>
            </div>

            <Footer settings={data.settings} />
        </>
    );
}
