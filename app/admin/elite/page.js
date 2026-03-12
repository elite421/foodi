'use client';
import { useState, useEffect } from 'react';

export default function AdminElite() {
    const [elite, setElite] = useState(null);
    const [toast, setToast] = useState('');
    useEffect(() => { fetch('/api/admin/elite').then(r => r.json()).then(setElite); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const saveMain = async () => {
        await fetch('/api/admin/elite', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: elite.title, tagline: elite.tagline, free_delivery: elite.free_delivery, free_dishes: elite.free_dishes })
        });
        showToast('Elite section saved!');
    };

    const addItem = async () => {
        const label = prompt('Item label (e.g. Above ₹449)');
        const image = prompt('Image URL');
        if (!label || !image) return;
        await fetch('/api/admin/elite', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addItem', item: { label, image } })
        });
        fetch('/api/admin/elite').then(r => r.json()).then(setElite);
        showToast('Item added!');
    };

    const delItem = async (id) => {
        if (!confirm('Delete this item?')) return;
        await fetch('/api/admin/elite', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'deleteItem', itemId: id })
        });
        fetch('/api/admin/elite').then(r => r.json()).then(setElite);
        showToast('Item deleted');
    };

    if (!elite) return <p>Loading...</p>;
    return (
        <>
            <div className="admin-header">
                <h1>👑 Elite Membership</h1>
                <button className="btn-admin btn-admin-primary" onClick={saveMain}>Save Changes</button>
            </div>
            <div className="admin-card">
                <h3>Elite Settings</h3>
                <div className="admin-form">
                    <div className="form-row">
                        <div className="form-group"><label>Title</label><input value={elite.title || ''} onChange={e => setElite({ ...elite, title: e.target.value })} /></div>
                        <div className="form-group"><label>Tagline</label><input value={elite.tagline || ''} onChange={e => setElite({ ...elite, tagline: e.target.value })} /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Free Delivery Threshold</label><input value={elite.free_delivery || ''} onChange={e => setElite({ ...elite, free_delivery: e.target.value })} /></div>
                        <div className="form-group"><label>Free Dishes Threshold</label><input value={elite.free_dishes || ''} onChange={e => setElite({ ...elite, free_dishes: e.target.value })} /></div>
                    </div>
                </div>
            </div>
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Elite Items</h3>
                    <button className="btn-admin btn-admin-primary" onClick={addItem}>+ Add Item</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '1rem' }}>
                    {(elite.items || []).map(i => (
                        <div key={i.id} style={{ textAlign: 'center', background: '#f8fafc', padding: '1rem', borderRadius: 12 }}>
                            <img src={i.image} alt={i.label} style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }} />
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: '8px 0 4px' }}>{i.label}</p>
                            <button className="btn-admin btn-admin-danger" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => delItem(i.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            {toast && <div className="toast">{toast}</div>}
        </>
    );
}
