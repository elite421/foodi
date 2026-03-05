'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MenuSection from '../../components/MenuSection';
import LocationGate from '../../components/LocationGate';
import { useLocation } from '../../components/LocationContext';

export default function BrandClientWrapper({ brand, categories, menuItems, settings }) {
    const { location, locationLoading, deliveryAvailable, setLocation, clearLocation } = useLocation();

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
        return <LocationGate settings={settings} menuItems={menuItems} onLocationSet={setLocation} />;
    }

    return (
        <>
            <Navbar settings={settings} location={location} onClearLocation={clearLocation} onSetLocation={setLocation} deliveryAvailable={deliveryAvailable} />

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
