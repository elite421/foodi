'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MenuSection from '../../components/MenuSection';
import LocationGate from '../../components/LocationGate';
import { useLocation } from '../../components/LocationContext';

export default function BrandClientWrapper({ brand, categories, menuItems, settings, parties }) {
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

                {/* Parties Section */}
                {parties && parties.length > 0 && (
                    <section style={{ padding: '3rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '2rem', textAlign: 'center' }}>
                            🎉 Upcoming Parties & Events
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {parties.filter(p => p.isActive).map(party => (
                                <div key={party.id} style={{ 
                                    background: 'white', 
                                    borderRadius: '16px', 
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    {party.image && (
                                        <img 
                                            src={party.image} 
                                            alt={party.name} 
                                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                                            {party.name}
                                        </h3>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            {party.description?.slice(0, 100)}...
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                                            <span>📅 {party.date ? new Date(party.date).toLocaleDateString() : 'TBA'}</span>
                                            <span>📍 {party.venue || 'TBA'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                👥 Max {party.maxGuests || 50} guests
                                            </span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4338ca' }}>
                                                {party.partyItems?.length || 0} items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer settings={settings} />
        </>
    );
}
