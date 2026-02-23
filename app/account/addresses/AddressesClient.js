'use client';
import { useState, useEffect } from 'react';

export default function AddressesClient() {
    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState({ label: '', street: '', city: '', state: '', zip: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/user/addresses').then(r => r.json()).then(d => {
            if (d.success) setAddresses(d.addresses);
        });
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch('/api/user/addresses', { method: 'POST', body: JSON.stringify(form) });
        const d = await res.json();
        setSaving(false);
        if (d.success) {
            setAddresses([...addresses, d.address]);
            setForm({ label: '', street: '', city: '', state: '', zip: '' });
        } else alert(d.error);
    };

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>My Addresses</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {addresses.map(a => (
                    <div key={a.id} style={{ padding: '1.5rem', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>{a.label}</h3>
                        <p style={{ margin: 0, color: '#64748b' }}>{a.street}<br />{a.city}, {a.state} {a.zip}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={submit} style={{ padding: '1.5rem', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Add New Address</h2>
                <input required placeholder="Label (e.g., Home, Work)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
                <textarea required placeholder="Street Address" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                    <input required placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
                    <input required placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
                    <input required placeholder="ZIP Code" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
                </div>
                <button type="submit" disabled={saving} style={{ padding: 12, background: '#4338ca', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold' }}>
                    {saving ? 'Adding...' : 'Save Address'}
                </button>
            </form>
        </div>
    );
}
