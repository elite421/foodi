'use client';
import { useCart } from '../components/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '../components/AuthModal';

export default function CheckoutClient({ settings, coupons, initialUser }) {
    const { cart, updateQty, cartTotal, clearCart } = useCart();
    const [user, setUser] = useState(initialUser);
    const [authOpen, setAuthOpen] = useState(false);
    const [addressId, setAddressId] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(settings.razorpayKeyId ? 'ONLINE' : 'COD');
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
    };

    const handleCheckout = async () => {
        if (!user) return setAuthOpen(true);
        if (!addressId) return router.push('/account/addresses'); // Redirect to create address
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

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLoginSuccess={setUser} />
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
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
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 24, marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Order Items</h2>
                        {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                                    <div style={{ color: '#64748b' }}>₹{item.price} x {item.qty}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#e2e8f0' }}>-</button>
                                    <span style={{ fontWeight: 600 }}>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f59e0b', color: 'white' }}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Delivery Address</h2>
                        {!user ? (
                            <button onClick={() => setAuthOpen(true)} className="btn-signin">Sign in to add address</button>
                        ) : addresses.length === 0 ? (
                            <button onClick={() => router.push('/account/addresses')} className="btn-signin">Add New Address</button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {addresses.map(a => (
                                    <label key={a.id} style={{ display: 'flex', gap: 10, padding: 12, border: addressId === a.id ? '2px solid #4338ca' : '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer' }}>
                                        <input type="radio" name="address" checked={addressId === a.id} onChange={() => setAddressId(a.id)} />
                                        <div>
                                            <strong>{a.label}</strong>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>{a.street}, {a.city}, {a.state} {a.zip}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Payment Method</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {settings.razorpayKeyId && (
                                <label style={{ display: 'flex', gap: 10, padding: 12, border: paymentMethod === 'ONLINE' ? '2px solid #4338ca' : '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer' }}>
                                    <input type="radio" name="paymentMethod" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
                                    <div>
                                        <strong>Pay Online</strong>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>UPI, Cards, Wallets, NetBanking</p>
                                    </div>
                                </label>
                            )}
                            <label style={{ display: 'flex', gap: 10, padding: 12, border: paymentMethod === 'COD' ? '2px solid #4338ca' : '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer' }}>
                                <input type="radio" name="paymentMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                <div>
                                    <strong>Cash on Delivery (COD)</strong>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Pay when you receive the order</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div style={{ flex: '1 1 300px' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 24, position: 'sticky', top: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Bill Details</h2>

                        <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
                            <input type="text" placeholder="Coupon Code" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                                style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0', textTransform: 'uppercase' }} />
                            <button onClick={applyCoupon} style={{ padding: '0 16px', borderRadius: 12, background: '#0f172a', color: 'white', border: 'none', fontWeight: 600 }}>Apply</button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span>Item Total</span><span>₹{cartTotal.toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span>Taxes</span><span>₹{tax.toFixed(2)}</span></div>
                        {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#10b981', fontWeight: 600 }}><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
                        <hr style={{ border: 'none', borderTop: '2px dashed #e2e8f0', margin: '1rem 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800 }}><span>To Pay</span><span>₹{finalTotal.toFixed(2)}</span></div>

                        <button disabled={loading || cart.length === 0} onClick={handleCheckout} style={{
                            width: '100%', padding: '16px', background: 'linear-gradient(135deg, #4338ca, #7c3aed)', color: 'white',
                            borderRadius: 16, border: 'none', fontWeight: 700, fontSize: '1.2rem', marginTop: '1.5rem', cursor: loading || cart.length === 0 ? 'not-allowed' : 'pointer',
                            opacity: loading || cart.length === 0 ? 0.7 : 1
                        }}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
