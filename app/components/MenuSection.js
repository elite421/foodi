'use client';
import { useState } from 'react';
import { useCart } from './CartContext';

export default function MenuSection({ menuItems, categories }) {
    const [openCategory, setOpenCategory] = useState(categories?.[0]?.id || null);
    const { addToCart } = useCart();

    return (
        <section id="menu">
            <div className="section-header">
                <h2>Our <span>Menu</span></h2>
            </div>

            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }} className="hide-scroll">
                {(categories || []).map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setOpenCategory(cat.id)}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '30px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            border: 'none',
                            background: openCategory === cat.id ? '#4338ca' : '#f1f5f9',
                            color: openCategory === cat.id ? 'white' : '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            <div className="restaurants-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {(menuItems || []).filter(m => m.categoryId === openCategory).map(item => (
                    <div key={item.id} className="restaurant-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="restaurant-card-img" style={{ height: 200 }}>
                            <img src={item.image} alt={item.name} loading="lazy" style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
                            <div className="restaurant-card-offer" style={{
                                background: item.isVeg ? '#10b981' : '#ef4444',
                                top: 12, right: 12, left: 'auto'
                            }}>
                                {item.isVeg ? '🟩 VEG' : '🟥 NON-VEG'}
                            </div>
                        </div>
                        <div className="restaurant-card-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{item.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>₹{item.price}</span>
                                {item.isAvailable ? (
                                    <button onClick={() => addToCart(item)} style={{
                                        background: '#f59e0b', color: 'white', padding: '8px 20px',
                                        borderRadius: '20px', fontWeight: 700, border: 'none', cursor: 'pointer'
                                    }}>
                                        Add to Cart
                                    </button>
                                ) : (
                                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>Out of Stock</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
