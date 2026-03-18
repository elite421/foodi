'use client';
import { useState, useEffect } from 'react';

export default function PartySection() {
    const [step, setStep] = useState(1); // 1: Details, 2: Items, 3: Review, 4: Success
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        city: '',
        date: '',
        guests: '',
        email: '',
        occasion: ''
    });
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (step === 2) {
            fetchMenuItems();
        }
    }, [step]);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/menu');
            const data = await res.json();
            if (data.menuItems) {
                setMenuItems(data.menuItems);
            }
        } catch (err) {
            console.error('Error fetching menu:', err);
            setError('Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleProceed = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.contact || !formData.city || !formData.date || !formData.guests) {
            setError('Please fill all required fields');
            return;
        }
        if (formData.contact.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        setStep(2);
    };

    const addItem = (item) => {
        const existing = selectedItems.find(i => i.menuItemId === item.id);
        if (existing) {
            setSelectedItems(selectedItems.map(i => 
                i.menuItemId === item.id 
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ));
        } else {
            setSelectedItems([...selectedItems, {
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                image: item.image
            }]);
        }
    };

    const removeItem = (menuItemId) => {
        setSelectedItems(selectedItems.filter(i => i.menuItemId !== menuItemId));
    };

    const updateQuantity = (menuItemId, delta) => {
        setSelectedItems(selectedItems.map(i => {
            if (i.menuItemId === menuItemId) {
                const newQty = i.quantity + delta;
                if (newQty <= 0) return null;
                return { ...i, quantity: newQty };
            }
            return i;
        }).filter(Boolean));
    };

    const calculateTotal = () => {
        return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleFinalSubmit = async () => {
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/party', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: selectedItems,
                    totalAmount: calculateTotal()
                })
            });

            const data = await res.json();

            if (res.ok) {
                setStep(4);
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setFormData({
            name: '',
            contact: '',
            city: '',
            date: '',
            guests: '',
            email: '',
            occasion: ''
        });
        setSelectedItems([]);
        setError('');
    };

    if (step === 4) {
        return (
            <section className="party-section" id="party-section">
                <div className="party-section-inner">
                    <div className="party-hero-content">
                        <h2 className="party-hero-title">
                            🎉 Let's <span>Celebrate</span> Together!
                        </h2>
                        <p className="party-hero-subtitle">
                            Birthday parties, corporate events, anniversaries & more — we make every occasion delicious!
                        </p>
                    </div>
                    <div className="party-form-card">
                        <div className="party-success-message" id="party-success">
                            <div className="party-success-icon">🎊</div>
                            <h3>Thank You!</h3>
                            <p>Your party booking request has been submitted successfully with {selectedItems.length} items. Our team will contact you shortly to confirm the details!</p>
                            <button
                                className="party-submit-btn"
                                onClick={resetForm}
                                style={{ marginTop: '1.5rem' }}
                            >
                                Book Another Party
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="party-section" id="party-section">
            <div className="party-section-inner">
                {/* Left side - Hero content */}
                <div className="party-hero-content">
                    <div className="party-badge">🎈 Party Bookings</div>
                    <h2 className="party-hero-title">
                        Let's <span>Celebrate</span> Together!
                    </h2>
                    <p className="party-hero-subtitle">
                        Birthday parties, corporate events, anniversaries & more — we make every occasion delicious!
                    </p>
                    <div className="party-features">
                        <div className="party-feature">
                            <span className="party-feature-icon">🍽️</span>
                            <div>
                                <strong>Custom Menus</strong>
                                <p>Tailored to your taste & budget</p>
                            </div>
                        </div>
                        <div className="party-feature">
                            <span className="party-feature-icon">👨‍🍳</span>
                            <div>
                                <strong>Professional Service</strong>
                                <p>Expert catering team</p>
                            </div>
                        </div>
                        <div className="party-feature">
                            <span className="party-feature-icon">🎂</span>
                            <div>
                                <strong>All Occasions</strong>
                                <p>From intimate to grand events</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Form Card */}
                <div className="party-form-card" id="party-form-card">
                    {/* Progress Steps */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: step >= s ? '#4338ca' : '#e2e8f0',
                                color: step >= s ? 'white' : '#64748b',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>
                                {s}
                            </div>
                        ))}
                    </div>

                    {error && <div className="party-form-error" id="party-error">{error}</div>}

                    {/* Step 1: Party Details */}
                    {step === 1 && (
                        <>
                            <h3 className="party-form-title">Step 1: Party Details</h3>
                            <form onSubmit={handleProceed} className="party-form" id="party-booking-form">
                        {/* Your Name - Full width */}
                        <div className="party-field party-field-full">
                            <span className="party-required">*</span>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                id="party-name"
                                className="party-input"
                            />
                        </div>

                        {/* Contact & City - Side by side */}
                        <div className="party-field-row">
                            <div className="party-field">
                                <span className="party-required">*</span>
                                <input
                                    type="tel"
                                    name="contact"
                                    placeholder="Contact number"
                                    value={formData.contact}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData(prev => ({ ...prev, contact: val }));
                                        setError('');
                                    }}
                                    required
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    title="Please enter 10 digit phone number"
                                    id="party-contact"
                                    className="party-input"
                                />
                            </div>
                            <div className="party-field">
                                <span className="party-required">*</span>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    id="party-city"
                                    className="party-input"
                                />
                            </div>
                        </div>

                        {/* Date & Guests - Side by side */}
                        <div className="party-field-row">
                            <div className="party-field">
                                <span className="party-required">*</span>
                                <input
                                    type="date"
                                    name="date"
                                    placeholder="Date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    id="party-date"
                                    className="party-input"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="party-field">
                                <span className="party-required">*</span>
                                <input
                                    type="number"
                                    name="guests"
                                    placeholder="No. of guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    id="party-guests"
                                    className="party-input"
                                />
                            </div>
                        </div>

                        {/* Email - Full width */}
                        <div className="party-field party-field-full">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                id="party-email"
                                className="party-input"
                            />
                        </div>

                        {/* Occasion - Full width */}
                        <div className="party-field party-field-full">
                            <input
                                type="text"
                                name="occasion"
                                placeholder="What's the occasion?"
                                value={formData.occasion}
                                onChange={handleChange}
                                id="party-occasion"
                                className="party-input"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="party-submit-btn"
                            id="party-submit-btn"
                        >
                            {loading ? 'Loading...' : 'Proceed to Add Items →'}
                        </button>
                    </form>
                        </>
                    )}

                    {/* Step 2: Select Items */}
                    {step === 2 && (
                        <>
                            <h3 className="party-form-title">Step 2: Select Menu Items</h3>
                            
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p>Loading menu items...</p>
                                </div>
                            ) : (
                                <>
                                    {selectedItems.length > 0 && (
                                        <div style={{ 
                                            background: '#f0fdf4', 
                                            padding: '1rem', 
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 600 }}>
                                                    {selectedItems.length} items selected
                                                </span>
                                                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                                                    ₹{calculateTotal().toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ 
                                        maxHeight: '350px', 
                                        overflowY: 'auto',
                                        marginBottom: '1rem'
                                    }}>
                                        {menuItems.length === 0 ? (
                                            <p style={{ textAlign: 'center', color: '#64748b' }}>
                                                No menu items available
                                            </p>
                                        ) : (
                                            menuItems.map(item => {
                                                const selected = selectedItems.find(i => i.menuItemId === item.id);
                                                return (
                                                    <div key={item.id} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0.75rem',
                                                        borderBottom: '1px solid #e2e8f0',
                                                        gap: '0.75rem'
                                                    }}>
                                                        <img 
                                                            src={item.image || '/default-food.png'} 
                                                            alt={item.name}
                                                            style={{ 
                                                                width: '50px', 
                                                                height: '50px', 
                                                                objectFit: 'cover',
                                                                borderRadius: '6px'
                                                            }}
                                                        />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                                                ₹{item.price}
                                                            </div>
                                                        </div>
                                                        
                                                        {selected ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>−</button>
                                                                <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{selected.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>+</button>
                                                                <button onClick={() => removeItem(item.id)} style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Remove</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => addItem(item)} style={{ padding: '0.5rem 1rem', background: '#4338ca', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Add</button>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button onClick={() => setStep(1)} style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                                        <button onClick={() => setStep(3)} disabled={selectedItems.length === 0} style={{ flex: 2, padding: '0.75rem', background: selectedItems.length > 0 ? '#4338ca' : '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 600 }}>
                                            {selectedItems.length > 0 ? `Review Order (${selectedItems.length} items)` : 'Select at least 1 item'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Step 3: Review & Submit */}
                    {step === 3 && (
                        <>
                            <h3 className="party-form-title">Step 3: Review Your Party Booking</h3>
                            
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                <h4 style={{ margin: '0 0 0.75rem 0', color: '#4338ca' }}>Party Details</h4>
                                <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    <div><strong>Name:</strong> {formData.name}</div>
                                    <div><strong>Contact:</strong> {formData.contact}</div>
                                    <div><strong>City:</strong> {formData.city}</div>
                                    <div><strong>Date:</strong> {formData.date}</div>
                                    <div><strong>Guests:</strong> {formData.guests}</div>
                                    {formData.email && <div><strong>Email:</strong> {formData.email}</div>}
                                    {formData.occasion && <div><strong>Occasion:</strong> {formData.occasion}</div>}
                                </div>
                            </div>

                            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <h4 style={{ margin: 0, color: '#16a34a' }}>Selected Items</h4>
                                    <button onClick={() => setStep(2)} style={{ padding: '0.25rem 0.75rem', background: 'white', border: '1px solid #16a34a', color: '#16a34a', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit Items</button>
                                </div>
                                {selectedItems.map(item => (
                                    <div key={item.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed #bbf7d0' }}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '2px solid #16a34a', fontWeight: 700, fontSize: '1.1rem', color: '#16a34a' }}>
                                    <span>Total Amount</span>
                                    <span>₹{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setStep(2)} disabled={submitting} style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                                <button onClick={handleFinalSubmit} disabled={submitting} style={{ flex: 2, padding: '0.75rem', background: '#4338ca', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                    {submitting ? 'Submitting...' : 'Confirm & Submit Party Booking'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
