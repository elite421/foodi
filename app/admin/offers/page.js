'use client';
import { useState, useEffect } from 'react';

const empty = { title: '', subtitle: '', restaurant: '', image: '', bg_color: '#4338ca', active: true };

export default function AdminOffers() {
    const [items, setItems] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [toast, setToast] = useState('');

    const load = () => fetch('/api/admin/offers').then(r => r.json()).then(setItems);
    useEffect(() => { load(); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const save = async () => {
        const method = modal === 'add' ? 'POST' : 'PUT';
        await fetch('/api/admin/offers', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        load(); setModal(null); showToast(modal === 'add' ? 'Offer added!' : 'Offer updated!');
    };

    const del = async (id) => {
        if (!confirm('Delete this offer?')) return;
        await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' });
        load(); showToast('Offer deleted');
    };

    return (
        <>
            <div className="admin-header">
                <h1>🎁 Offers</h1>
                <button className="btn-admin btn-admin-primary" onClick={() => { setForm(empty); setModal('add'); }}>+ Add Offer</button>
            </div>
            <div className="admin-card">
                <table className="admin-table">
                    <thead><tr><th>Image</th><th>Title</th><th>Restaurant</th><th>Active</th><th>Actions</th></tr></thead>
                    <tbody>
                        {items.map(o => (
                            <tr key={o.id}>
                                <td><img src={o.image} alt={o.title} /></td>
                                <td><strong>{o.title}</strong><br /><span style={{ fontSize: '0.8rem', color: '#64748b' }}>{o.subtitle}</span></td>
                                <td>{o.restaurant}</td>
                                <td>{o.active ? '✅' : '❌'}</td>
                                <td className="admin-actions">
                                    <button className="btn-admin btn-admin-outline" onClick={() => { setForm(o); setModal('edit'); }}>Edit</button>
                                    <button className="btn-admin btn-admin-danger" onClick={() => del(o.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{modal === 'add' ? 'Add Offer' : 'Edit Offer'}</h2>
                        <div className="admin-form">
                            <div className="form-row">
                                <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                                <div className="form-group"><label>Restaurant</label><input value={form.restaurant} onChange={e => setForm({ ...form, restaurant: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Subtitle</label><input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
                            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
                            <div className="form-row">
                                <div className="form-group"><label>Background Color</label><input type="color" value={form.bg_color} onChange={e => setForm({ ...form, bg_color: e.target.value })} /></div>
                                <div className="form-group"><label><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active</label></div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-admin btn-admin-outline" onClick={() => setModal(null)}>Cancel</button>
                            <button className="btn-admin btn-admin-primary" onClick={save}>Save</button>
                        </div>
                    </div>
                </div>
            )}
            {toast && <div className="toast">{toast}</div>}
        </>
    );
}
