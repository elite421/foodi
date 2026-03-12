'use client';
import { useState } from 'react';

export default function PartySection() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        city: '',
        date: '',
        guests: '',
        email: '',
        occasion: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/party', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: '', contact: '', city: '', date: '', guests: '', email: '', occasion: '' });
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
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
                            <p>Your party booking request has been submitted successfully. Our team will contact you shortly to confirm the details!</p>
                            <button
                                className="party-submit-btn"
                                onClick={() => setSubmitted(false)}
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
                    <h3 className="party-form-title">Help us delight you by filling this.</h3>

                    {error && <div className="party-form-error" id="party-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="party-form" id="party-booking-form">
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
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
