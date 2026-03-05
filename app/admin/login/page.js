'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return; }
            router.push('/admin');
        } catch { setError('Network error'); setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)' }}>
            <form onSubmit={handleLogin} style={{
                background: 'white', padding: '3rem', borderRadius: '20px', width: '100%', maxWidth: '420px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 64, height: 64, background: 'linear-gradient(135deg, #4338ca, #7c3aed)', borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, margin: '0 auto 12px'
                    }}>FC</div>
                    <h1 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 700, color: '#1e1e2e' }}>Admin Login</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>Sign in to manage FooodieClub</p>
                </div>
                {error && <div style={{
                    background: '#fef2f2', color: '#dc2626', padding: '10px 16px', borderRadius: 8,
                    fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #fecaca'
                }}>{error}</div>}
                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                        placeholder="Enter username"
                        style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                        placeholder="Enter password"
                        style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                    color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem',
                    cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1
                }}>{loading ? 'Signing in...' : 'Sign In'}</button>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Default: admin / admin123
                </p>
            </form>
        </div>
    );
}
