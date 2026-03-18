'use client';

import { useCart } from '../components/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function CartClient({ settings }) {
    const { cart, updateQty, cartTotal, clearCart, cartCount } = useCart();
    const router = useRouter();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [quickTip, setQuickTip] = useState(null);

    const deliveryFee = cartTotal > 0 ? (settings?.baseDeliveryFee || 40) : 0;
    const tax = cartTotal * ((settings?.taxPercentage || 5) / 100);
    const finalTotal = cartTotal + tax + deliveryFee;

    const quickAddAmounts = [50, 100, 200];
    const popularItems = [
        { id: 'quick-1', name: 'Garlic Bread', price: 149, emoji: '🥖' },
        { id: 'quick-2', name: 'Soft Drink', price: 79, emoji: '🥤' },
        { id: 'quick-3', name: 'French Fries', price: 129, emoji: '🍟' },
        { id: 'quick-4', name: 'Dessert', price: 199, emoji: '🍰' },
    ];

    const handleQuickAdd = (item) => {
        // Check if item already exists in cart
        const existingItem = cart.find(i => i.id === item.id);
        if (existingItem) {
            updateQty(item.id, 1);
        } else {
            // Add as new item with qty 1
            const event = new CustomEvent('addToCart', { detail: { ...item, qty: 1 } });
            window.dispatchEvent(event);
        }
        setQuickTip(`Added ${item.name} to cart!`);
        setTimeout(() => setQuickTip(null), 2000);
    };

    if (cart.length === 0) {
        return (
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Quick Back Button */}
                <button
                    onClick={() => router.back()}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: '#0f172a',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'all 0.2s ease',
                        marginBottom: '1.5rem'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#4338ca'; e.currentTarget.style.color = '#4338ca'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                >
                    ←
                </button>

                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Your cart is empty</h1>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
                    
                    {/* Quick Actions for Empty Cart */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <Link href="/menu" style={{
                            padding: '14px 28px',
                            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                            color: 'white',
                            borderRadius: 14,
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'transform 0.2s'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            🍽️ Browse Menu
                        </Link>
                        <Link href="/" style={{
                            padding: '14px 28px',
                            background: '#f1f5f9',
                            color: '#0f172a',
                            borderRadius: 14,
                            textDecoration: 'none',
                            fontWeight: 600,
                            border: '1px solid #e2e8f0'
                        }}>
                            🏠 Go Home
                        </Link>
                    </div>

                    {/* Quick Add Popular Items */}
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem' }}>Popular add-ons</h3>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {popularItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleQuickAdd(item)}
                                    style={{
                                        padding: '12px 20px',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4338ca'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <span>{item.emoji}</span>
                                    <span>{item.name}</span>
                                    <span style={{ color: '#4338ca', fontWeight: 600 }}>₹{item.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Quick Tip Toast */}
            {quickTip && (
                <div style={{
                    position: 'fixed',
                    top: 100,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#10b981',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: 12,
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    animation: 'slideDown 0.3s ease'
                }}>
                    ✅ {quickTip}
                </div>
            )}

            {/* Header with Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: '#0f172a',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#4338ca'; e.currentTarget.style.color = '#4338ca'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                >
                    ←
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, fontFamily: 'Outfit' }}>Your Cart</h1>
                <span style={{ 
                    background: '#4338ca', 
                    color: 'white', 
                    padding: '4px 12px', 
                    borderRadius: 20,
                    fontSize: '0.9rem',
                    fontWeight: 600 
                }}>
                    {cartCount} items
                </span>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => router.push('/menu')}
                        style={{
                            padding: '10px 18px',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: 10,
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                    >
                        ➕ Add More
                    </button>
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        style={{
                            padding: '10px 18px',
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 10,
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                    >
                        🗑️ Clear
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Cart Items */}
                <div style={{ flex: '1 1 550px' }}>
                    <div style={{ background: 'white', borderRadius: 24, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#0f172a' }}>Order Items</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map((item, index) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: 16,
                                    transition: 'background 0.2s'
                                }}>
                                    <div style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 12,
                                        background: 'linear-gradient(135deg, #4338ca20, #7c3aed20)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        flexShrink: 0
                                    }}>
                                        {item.emoji || '🍽️'}
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>₹{item.price} each</div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '6px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                        <button 
                                            onClick={() => updateQty(item.id, -1)}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                border: 'none',
                                                background: '#e2e8f0',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#cbd5e1'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                                        >
                                            −
                                        </button>
                                        <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                                        <button 
                                            onClick={() => updateQty(item.id, 1)}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                border: 'none',
                                                background: '#4338ca',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#3730a3'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#4338ca'; }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <div style={{ fontWeight: 700, color: '#0f172a', minWidth: 70, textAlign: 'right' }}>
                                        ₹{(item.price * item.qty).toFixed(0)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Add More Section */}
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px dashed #e2e8f0' }}>
                            <h3 style={{ fontSize: '0.95rem', color: '#64748b', margin: '0 0 1rem 0' }}>Frequently bought together</h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {popularItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleQuickAdd(item)}
                                        style={{
                                            padding: '10px 16px',
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 10,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4338ca'; e.currentTarget.style.background = '#f8fafc'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                                    >
                                        <span>{item.emoji}</span>
                                        <span>{item.name}</span>
                                        <span style={{ color: '#4338ca', fontWeight: 600 }}>+₹{item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div style={{ flex: '1 1 320px' }}>
                    <div style={{ 
                        background: 'white', 
                        borderRadius: 24, 
                        padding: '1.5rem', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        position: 'sticky',
                        top: 100
                    }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#0f172a' }}>Order Summary</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                <span>Items ({cartCount})</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                <span>Taxes ({settings?.taxPercentage || 5}%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            
                            {cartTotal > 500 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    background: '#f0fdf4',
                                    borderRadius: 10,
                                    marginTop: '0.5rem'
                                }}>
                                    <span>✨</span>
                                    <span style={{ fontSize: '0.9rem', color: '#15803d' }}>Free delivery on orders above ₹500!</span>
                                </div>
                            )}
                            
                            <hr style={{ border: 'none', borderTop: '2px dashed #e2e8f0', margin: '1rem 0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                                <span>Total</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Quick Checkout Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => router.push('/checkout')}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 14,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(67, 56, 202, 0.35)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                🚀 Proceed to Checkout
                            </button>
                            
                            <button
                                onClick={() => router.push('/menu')}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background: '#f1f5f9',
                                    color: '#0f172a',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 14,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                            >
                                ➕ Add More Items
                            </button>
                        </div>

                        {/* Quick Saver Tip */}
                        {cartTotal < 500 && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '12px',
                                background: '#fef3c7',
                                borderRadius: 10,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>💡</span>
                                <span style={{ fontSize: '0.85rem', color: '#92400e' }}>
                                    Add ₹{(500 - cartTotal).toFixed(0)} more for free delivery!
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Clear Cart Confirmation Modal */}
            {showClearConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(4px)'
                }} onClick={() => setShowClearConfirm(false)}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: 20,
                        maxWidth: 400,
                        width: '90%',
                        textAlign: 'center'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Clear your cart?</h3>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>This will remove all items from your cart.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: '#f1f5f9',
                                    border: 'none',
                                    borderRadius: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    clearCart();
                                    setShowClearConfirm(false);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
