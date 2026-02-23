'use client';
import { useState, useEffect } from 'react';

const empty = { name: '', slug: '', image: '', description: '', isActive: true };

export default function AdminBrands() {
    const [items, setItems] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [toast, setToast] = useState('');

    const load = () => fetch('/api/admin/brands').then(r => r.json()).then(setItems);
    useEffect(() => { load(); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const save = async () => {
        const method = modal === 'add' ? 'POST' : 'PUT';
        await fetch('/api/admin/brands', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        load(); setModal(null); showToast(modal === 'add' ? 'Brand added!' : 'Brand updated!');
    };

    const del = async (id) => {
        if (!confirm('Delete this brand?')) return;
        await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
        load(); showToast('Brand deleted');
    };

    return (
        <>
            <div className="admin-header">
                <h1>🏢 Brands</h1>
                <button className="btn-admin btn-admin-primary" onClick={() => { setForm(empty); setModal('add'); }}>+ Add Brand</button>
            </div>
            <div className="admin-card">
                <table className="admin-table">
                    <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {items?.map(b => (
                            <tr key={b.id}>
                                <td><img src={b.image} alt={b.name} style={{ width: 50, height: 50, objectFit: 'contain' }} /></td>
                                <td>{b.name}</td>
                                <td>{b.slug}</td>
                                <td>{b.isActive ? 'Active' : 'Inactive'}</td>
                                <td className="admin-actions">
                                    <button className="btn-admin btn-admin-outline" onClick={() => { setForm(b); setModal('edit'); }}>Edit</button>
                                    <button className="btn-admin btn-admin-danger" onClick={() => del(b.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{modal === 'add' ? 'Add Brand' : 'Edit Brand'}</h2>
                        <div className="admin-form" style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Brand Name</label>
                                <input style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} value={form.name} onChange={e => {
                                    const name = e.target.value;
                                    setForm({ ...form, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') });
                                }} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Slug (URL path)</label>
                                <input style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Image URL</label>
                                <input style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                                <textarea style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '80px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                                <label style={{ fontWeight: 600 }}>Active (Show on website)</label>
                            </div>
                        </div>
                        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
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
