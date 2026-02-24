'use client';
import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP / Details
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', otp: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone }),
            });
            const data = await res.json();
            if (res.ok) {
                setIsLogin(data.userExists);
                setStep(2);
                setMessage(`OTP sent to ${formData.phone}`);
            } else {
                setError(data.error || 'Failed to send OTP');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/user/login' : '/api/auth/user/register';
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
            onLoginSuccess(data.user);
            setFormData({ name: '', email: '', phone: '', otp: '' });
            setStep(1);
        } else {
            setError(data.error || 'Authentication failed');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div style={{
                background: 'white', padding: '2.5rem', borderRadius: 24, width: '100%', maxWidth: 440,
                position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
                    fontSize: '1.5rem', cursor: 'pointer', color: '#64748b'
                }}>✕</button>

                <h2 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
                    {step === 1 ? 'Login / Sign Up' : (isLogin ? 'Welcome Back' : 'Create Account')}
                </h2>
                <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '2rem' }}>
                    {step === 1 ? 'Enter your phone number to continue' : (isLogin ? 'Enter the OTP to sign in' : 'Complete your details to sign up')}
                </p>

                {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: 12, marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                {message && <div style={{ background: '#f0fdf4', color: '#15803d', padding: '12px', borderRadius: 12, marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input required type="tel" placeholder="Phone Number" value={formData.phone}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData({ ...formData, phone: val });
                            }}
                            maxLength={10}
                            pattern="[0-9]{10}"
                            title="Please enter exactly 10 digits"
                            style={{ padding: '14px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1rem' }} />
                        <button disabled={loading} type="submit" style={{
                            marginTop: '1rem', padding: '14px', background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                            color: 'white', borderRadius: 12, fontWeight: 700, fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer',
                            border: 'none', opacity: loading ? 0.7 : 1
                        }}>
                            {loading ? 'Sending OTP...' : 'Next'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {!isLogin && (
                            <>
                                <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ padding: '14px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1rem' }} />
                                <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{ padding: '14px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1rem' }} />
                            </>
                        )}
                        <input required type="text" placeholder="Enter OTP" value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value })}
                            style={{ padding: '14px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1rem', letterSpacing: '4px', textAlign: 'center' }} />

                        <button disabled={loading} type="submit" style={{
                            marginTop: '1rem', padding: '14px', background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                            color: 'white', borderRadius: 12, fontWeight: 700, fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer',
                            border: 'none', opacity: loading ? 0.7 : 1
                        }}>
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>

                        <button type="button" onClick={() => { setStep(1); setError(''); setMessage(''); }} style={{
                            marginTop: '0.5rem', padding: '14px', background: 'transparent',
                            color: '#64748b', fontWeight: 700, cursor: 'pointer', border: 'none'
                        }}>
                            Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
