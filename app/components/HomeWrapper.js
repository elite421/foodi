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
import { useLocation } from './LocationContext';

export default function HomeWrapper({ data }) {
    const { location, locationLoading, deliveryAvailable, setLocation, clearLocation } = useLocation();

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
                onLocationSet={setLocation}
            />
        );
    }

    // Location set → show main website
    return (
        <>
            <Navbar settings={data.settings} location={location} onClearLocation={clearLocation} onSetLocation={setLocation} deliveryAvailable={deliveryAvailable} />

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
                <MenuSection menuItems={data.menuItems} categories={data.categories} />
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
