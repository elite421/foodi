'use client';
import { useCart } from '../components/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthModal from '../components/AuthModal';

export default function CheckoutClient({ settings, coupons, initialUser }) {
    const { cart, updateQty, cartTotal, clearCart, cartCount } = useCart();
    const [user, setUser] = useState(initialUser);
    const [authOpen, setAuthOpen] = useState(false);
    const [addressId, setAddressId] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(settings.razorpayKeyId ? 'ONLINE' : 'COD');
    const [quickTip, setQuickTip] = useState(null);
    const [showQuickAddons, setShowQuickAddons] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({ label: '', street: '', city: '', state: '', zip: '' });
    const [savingAddress, setSavingAddress] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (settings.razorpayKeyId) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, [settings.razorpayKeyId]);

    const tax = cartTotal * ((settings.taxPercentage || 5) / 100);
    const deliveryFee = cartTotal > 0 ? (settings.baseDeliveryFee || 40) : 0;
    const finalTotal = cartTotal + tax + deliveryFee - discount;

    useEffect(() => {
        if (user) {
            fetch('/api/user/addresses').then(r => r.json()).then(d => {
                if (d.addresses?.length) {
                    setAddresses(d.addresses);
                    setAddressId(d.addresses[0].id);
                }
            });
        }
    }, [user]);

    const applyCoupon = () => {
        const c = coupons.find(x => x.code.toUpperCase() === couponCode.toUpperCase());
        if (!c) return alert('Invalid coupon');
        if (cartTotal < c.minOrderValue) return alert(`Min order value is ₹${c.minOrderValue}`);

        let calculated = c.discountType === 'PERCENTAGE' ? cartTotal * (c.discountValue / 100) : c.discountValue;
        if (c.maxDiscount && calculated > c.maxDiscount) calculated = c.maxDiscount;
        setDiscount(calculated);
        setQuickTip(`Coupon applied! You saved ₹${calculated.toFixed(0)}`);
        setTimeout(() => setQuickTip(null), 3000);
    };

    const popularAddons = [
        { id: 'addon-1', name: 'Garlic Bread', price: 149, emoji: '🥖' },
        { id: 'addon-2', name: 'Soft Drink', price: 79, emoji: '🥤' },
        { id: 'addon-3', name: 'Dip Sauce', price: 49, emoji: '🥫' },
        { id: 'addon-4', name: 'Extra Cheese', price: 99, emoji: '🧀' },
    ];

    const handleQuickAdd = (item) => {
        const existingItem = cart.find(i => i.id === item.id);
        if (existingItem) {
            updateQty(item.id, 1);
        } else {
            const event = new CustomEvent('addToCart', { detail: { ...item, qty: 1 } });
            window.dispatchEvent(event);
        }
        setQuickTip(`Added ${item.name} to cart!`);
        setTimeout(() => setQuickTip(null), 2000);
    };

    const saveAddress = async (e) => {
        e.preventDefault();
        setSavingAddress(true);
        const res = await fetch('/api/user/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressForm)
        });
        const d = await res.json();
        setSavingAddress(false);
        if (d.success) {
            setAddresses([...addresses, d.address]);
            setAddressId(d.address.id);
            setAddressForm({ label: '', street: '', city: '', state: '', zip: '' });
            setShowAddressModal(false);
        } else {
            alert(d.error || 'Failed to save address');
        }
    };

    const handleCheckout = async () => {
        if (!user) return setAuthOpen(true);
        if (!addressId) {
            setShowAddressModal(true);
            return;
        }
        if (cart.length === 0) return alert('Cart is empty');

        setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, addressId, couponCode: discount > 0 ? couponCode : null, paymentMethod })
            });
            const d = await res.json();

            if (!d.success) {
                setLoading(false);
                return alert(d.error);
            }

            clearCart();

            if (d.needsPayment && d.razorpayOrderId && window.Razorpay) {
                const options = {
                    key: d.key,
                    amount: d.amount,
                    currency: 'INR',
                    name: settings.siteName || 'FooodieClub',
                    description: 'Order Payment',
                    order_id: d.razorpayOrderId,
                    handler: async function (response) {
                        try {
                            const verifyRes = await fetch('/api/payment/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                    orderId: d.orderId
                                })
                            });
                            await verifyRes.json();
                            router.push('/account/orders/' + d.orderId);
                        } catch (err) {
                            alert('Payment verification error');
                            router.push('/account/orders/' + d.orderId);
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.phone
                    },
                    theme: { color: settings.primaryColor || '#4338ca' }
                };
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    alert('Payment Failed: ' + response.error.description);
                    router.push('/account/orders/' + d.orderId);
                });
                rzp.open();
                // don't turn off loading because modal is open
            } else {
                router.push('/account/orders/' + d.orderId);
            }
        } catch (err) {
            setLoading(false);
            alert('Something went wrong');
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Your cart is empty</h1>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add items to proceed with checkout.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLoginSuccess={setUser} />
            
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
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 600px' }}>
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
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#4338ca'; e.currentTarget.style.color = '#4338ca'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                            aria-label="Go back"
                        >
                            ←
                        </button>
                        <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 800, margin: 0 }}>Checkout</h1>
                        
                        {/* Quick Action Buttons */}
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
                            <Link href="/cart" style={{
                                padding: '10px 16px',
                                background: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                borderRadius: 10,
                                textDecoration: 'none',
                                color: '#0f172a',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                            }} onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}>
                                🛒 Edit Cart
                            </Link>
                            <Link href="/menu" style={{
                                padding: '10px 16px',
                                background: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                borderRadius: 10,
                                textDecoration: 'none',
                                color: '#0f172a',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                            }} onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}>
                                ➕ Add More
                            </Link>
                        </div>
                    </div>

                    {/* Order Items with Quick Add-ons */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 24, marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Order Items ({cartCount})</h2>
                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        
                        {cart.map(item => (
                            <div key={item.id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '1rem 0', 
                                borderBottom: '1px solid #f1f5f9' 
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        background: 'linear-gradient(135deg, #4338ca20, #7c3aed20)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem'
                                    }}>
                                        {item.emoji || '🍽️'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>₹{item.price} x {item.qty}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '6px', borderRadius: 10 }}>
                                    <button onClick={() => updateQty(item.id, -1)} style={{ 
                                        width: 28, 
                                        height: 28, 
                                        borderRadius: 8, 
                                        border: 'none', 
                                        background: '#e2e8f0',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }} onMouseEnter={(e) => e.currentTarget.style.background = '#cbd5e1'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = '#e2e8f0'}>−</button>
                                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} style={{ 
                                        width: 28, 
                                        height: 28, 
                                        borderRadius: 8, 
                                        border: 'none', 
                                        background: '#4338ca', 
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }} onMouseEnter={(e) => e.currentTarget.style.background = '#3730a3'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = '#4338ca'}>+</button>
                                </div>
                            </div>
                        ))}

                        {/* Quick Add-ons Toggle */}
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px dashed #e2e8f0' }}>
                            <button 
                                onClick={() => setShowQuickAddons(!showQuickAddons)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: showQuickAddons ? '#f0fdf4' : '#f8fafc',
                                    border: '1px dashed ' + (showQuickAddons ? '#86efac' : '#cbd5e1'),
                                    borderRadius: 12,
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    color: showQuickAddons ? '#15803d' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {showQuickAddons ? '🔽 Hide Quick Add-ons' : '➕ Quick Add Popular Items'}
                            </button>
                            
                            {showQuickAddons && (
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '0.75rem', 
                                    flexWrap: 'wrap', 
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: 12
                                }}>
                                    {popularAddons.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleQuickAdd(item)}
                                            style={{
                                                padding: '10px 14px',
                                                background: 'white',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: 10,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.85rem',
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
                            )}
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Delivery Address</h2>
                            {user && addresses.length > 0 && (
                                <button onClick={() => setShowAddressModal(true)} style={{
                                    color: '#4338ca',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}>
                                    + Add New
                                </button>
                            )}
                        </div>
                        
                        {!user ? (
                            <button onClick={() => setAuthOpen(true)} style={{
                                width: '100%',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 12,
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                                👤 Sign in to add address
                            </button>
                        ) : addresses.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                                <p style={{ color: '#64748b', marginBottom: '1rem' }}>No delivery address saved</p>
                                <button onClick={() => setShowAddressModal(true)} style={{
                                    display: 'inline-block',
                                    padding: '12px 24px',
                                    background: '#10b981',
                                    color: 'white',
                                    borderRadius: 12,
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}>
                                    + Add Delivery Address
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {addresses.map(a => (
                                    <label key={a.id} style={{ 
                                        display: 'flex', 
                                        gap: 12, 
                                        padding: '14px', 
                                        border: addressId === a.id ? '2px solid #4338ca' : '1px solid #e2e8f0', 
                                        borderRadius: 14, 
                                        cursor: 'pointer',
                                        background: addressId === a.id ? '#f8fafc' : 'white',
                                        transition: 'all 0.2s'
                                    }}>
                                        <input type="radio" name="address" checked={addressId === a.id} onChange={() => setAddressId(a.id)} style={{ marginTop: 2 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <strong style={{ color: '#0f172a' }}>{a.label}</strong>
                                                {addressId === a.id && <span style={{ fontSize: '0.75rem', background: '#4338ca', color: 'white', padding: '2px 8px', borderRadius: 10 }}>Selected</span>}
                                            </div>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>{a.street}, {a.city}, {a.state} {a.zip}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Payment Method</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {settings.razorpayKeyId && (
                                <label style={{ 
                                    display: 'flex', 
                                    gap: 12, 
                                    padding: '14px', 
                                    border: paymentMethod === 'ONLINE' ? '2px solid #4338ca' : '1px solid #e2e8f0', 
                                    borderRadius: 14, 
                                    cursor: 'pointer',
                                    background: paymentMethod === 'ONLINE' ? '#f8fafc' : 'white',
                                    transition: 'all 0.2s'
                                }}>
                                    <input type="radio" name="paymentMethod" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <strong style={{ color: '#0f172a' }}>💳 Pay Online</strong>
                                            {paymentMethod === 'ONLINE' && <span style={{ fontSize: '0.75rem', background: '#4338ca', color: 'white', padding: '2px 8px', borderRadius: 10 }}>Selected</span>}
                                        </div>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>UPI, Cards, Wallets, NetBanking</p>
                                    </div>
                                </label>
                            )}
                            <label style={{ 
                                display: 'flex', 
                                gap: 12, 
                                padding: '14px', 
                                border: paymentMethod === 'COD' ? '2px solid #4338ca' : '1px solid #e2e8f0', 
                                borderRadius: 14, 
                                cursor: 'pointer',
                                background: paymentMethod === 'COD' ? '#f8fafc' : 'white',
                                transition: 'all 0.2s'
                            }}>
                                <input type="radio" name="paymentMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <strong style={{ color: '#0f172a' }}>💵 Cash on Delivery</strong>
                                        {paymentMethod === 'COD' && <span style={{ fontSize: '0.75rem', background: '#4338ca', color: 'white', padding: '2px 8px', borderRadius: 10 }}>Selected</span>}
                                    </div>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>Pay when you receive the order</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Bill Summary Sidebar */}
                <div style={{ flex: '1 1 300px' }}>
                    <div style={{ 
                        background: 'white', 
                        padding: '1.5rem', 
                        borderRadius: 24, 
                        position: 'sticky', 
                        top: 100, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
                    }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Bill Details</h2>

                        {/* Coupon Section */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
                            <input 
                                type="text" 
                                placeholder="Enter Coupon" 
                                value={couponCode} 
                                onChange={e => setCouponCode(e.target.value)}
                                style={{ 
                                    flex: 1, 
                                    padding: '12px 14px', 
                                    borderRadius: 12, 
                                    border: '1px solid #e2e8f0', 
                                    textTransform: 'uppercase',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }} 
                            />
                            <button 
                                onClick={applyCoupon} 
                                style={{ 
                                    padding: '0 20px', 
                                    borderRadius: 12, 
                                    background: '#0f172a', 
                                    color: 'white', 
                                    border: 'none', 
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#0f172a'}
                            >
                                Apply
                            </button>
                        </div>

                        {/* Price Breakdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                <span>Item Total</span>
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
                            
                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                                    <span>🎉 Discount</span>
                                    <span>-₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                            
                            <hr style={{ border: 'none', borderTop: '2px dashed #e2e8f0', margin: '1rem 0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                                <span>To Pay</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Free Delivery Progress */}
                        {cartTotal < 500 && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '12px',
                                background: '#fef3c7',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>🚚</span>
                                <span style={{ fontSize: '0.85rem', color: '#92400e' }}>
                                    Add ₹{(500 - cartTotal).toFixed(0)} more for FREE delivery!
                                </span>
                            </div>
                        )}
                        
                        {cartTotal >= 500 && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '12px',
                                background: '#f0fdf4',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>✨</span>
                                <span style={{ fontSize: '0.85rem', color: '#15803d' }}>
                                    Yay! You get FREE delivery!
                                </span>
                            </div>
                        )}

                        {/* Place Order Button */}
                        <button 
                            disabled={loading || cart.length === 0 || (user && addresses.length === 0)} 
                            onClick={handleCheckout} 
                            style={{
                                width: '100%', 
                                padding: '16px', 
                                background: 'linear-gradient(135deg, #4338ca, #7c3aed)', 
                                color: 'white',
                                borderRadius: 16, 
                                border: 'none', 
                                fontWeight: 700, 
                                fontSize: '1.1rem', 
                                marginTop: '1.5rem', 
                                cursor: loading || cart.length === 0 || (user && addresses.length === 0) ? 'not-allowed' : 'pointer',
                                opacity: loading || cart.length === 0 || (user && addresses.length === 0) ? 0.6 : 1,
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                if (!(loading || cart.length === 0 || (user && addresses.length === 0))) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(67, 56, 202, 0.35)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {loading ? (
                                <>⏳ Processing...</>
                            ) : !user ? (
                                <>👤 Sign in to Order</>
                            ) : addresses.length === 0 ? (
                                <>📍 Add Address First</>
                            ) : (
                                <>🚀 Place Order</>
                            )}
                        </button>

                        {/* Secure Payment Badge */}
                        <div style={{
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            color: '#64748b',
                            fontSize: '0.85rem'
                        }}>
                            <span>🔒</span>
                            <span>Secure {paymentMethod === 'ONLINE' ? 'Online' : 'Cash on Delivery'} Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            {showAddressModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '1rem'
                }} onClick={() => setShowAddressModal(false)}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: 24,
                        width: '100%',
                        maxWidth: 500,
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>📍 Add Delivery Address</h2>
                        
                        <form onSubmit={saveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Label</label>
                                <input 
                                    required 
                                    placeholder="e.g., Home, Work, Office" 
                                    value={addressForm.label} 
                                    onChange={e => setAddressForm({ ...addressForm, label: e.target.value })} 
                                    style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem' }} 
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Street Address</label>
                                <textarea 
                                    required 
                                    placeholder="Enter your full street address" 
                                    value={addressForm.street} 
                                    onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} 
                                    style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem', minHeight: 80, resize: 'vertical' }} 
                                />
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>City</label>
                                    <input 
                                        required 
                                        placeholder="City" 
                                        value={addressForm.city} 
                                        onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} 
                                        style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>State</label>
                                    <input 
                                        required 
                                        placeholder="State" 
                                        value={addressForm.state} 
                                        onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} 
                                        style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>ZIP Code</label>
                                    <input 
                                        required 
                                        placeholder="ZIP" 
                                        value={addressForm.zip} 
                                        onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })} 
                                        style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem' }} 
                                    />
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button 
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    style={{ 
                                        flex: 1,
                                        padding: 14, 
                                        background: '#f1f5f9', 
                                        color: '#0f172a',
                                        border: 'none', 
                                        borderRadius: 12, 
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={savingAddress}
                                    style={{ 
                                        flex: 1,
                                        padding: 14, 
                                        background: 'linear-gradient(135deg, #4338ca, #7c3aed)', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: 12, 
                                        fontWeight: 600,
                                        cursor: savingAddress ? 'not-allowed' : 'pointer',
                                        opacity: savingAddress ? 0.7 : 1
                                    }}
                                >
                                    {savingAddress ? '⏳ Saving...' : '💾 Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
