'use client';
import { useState, useEffect } from 'react';

const empty = { name: '', description: '', image: '', categoryId: null, brandId: null, price: 0, isAvailable: true, isVeg: false, sortOrder: 0 };

export default function AdminMenu() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [brands, setBrands] = useState([]);
    const [toast, setToast] = useState('');

    const load = async () => {
        const res = await fetch('/api/admin/menu');
        if (res.ok) setItems(await res.json());

        const catRes = await fetch('/api/admin/categories');
        if (catRes.ok) setCategories(await catRes.json());

        const brandRes = await fetch('/api/admin/brands');
        if (brandRes.ok) setBrands(await brandRes.json());
    };

    useEffect(() => { load(); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const save = async () => {
        const method = modal === 'add' ? 'POST' : 'PUT';
        const payload = { ...form, categoryId: form.categoryId || null, brandId: form.brandId || null, price: Number(form.price) };
        const res = await fetch('/api/admin/menu', {
            method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (res.ok) { load(); setModal(null); showToast(modal === 'add' ? 'Menu item added!' : 'Menu item updated!'); }
        else { const d = await res.json(); showToast(d.error || 'Error'); }
    };

    const del = async (id) => {
        if (!confirm('Delete this menu item?')) return;
        await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' });
        load(); showToast('Menu item deleted');
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>🍽️ Menu Items</h1>
                <button className="btn-admin btn-admin-primary" onClick={() => { setForm(empty); setModal('add'); }}>+ Add Item</button>
            </div>
            <div className="table-container">
                <table className="admin-table">
                    <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Available</th><th>Type</th><th>Actions</th></tr></thead>
                    <tbody>
                        {items.map(m => (
                            <tr key={m.id}>
                                <td><img src={m.image} alt={m.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }} /></td>
                                <td><strong>{m.name}</strong></td>
                                <td>{m.category?.name || 'Uncategorized'}</td>
                                <td>{m.brand?.name || '-'}</td>
                                <td><strong>₹{m.price}</strong></td>
                                <td><span style={{ color: m.isAvailable ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{m.isAvailable ? 'Yes' : 'No'}</span></td>
                                <td><span style={{ color: m.isVeg ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{m.isVeg ? '🟩 Veg' : '🟥 Non-Veg'}</span></td>
                                <td className="admin-actions">
                                    <button className="btn-admin btn-admin-outline" onClick={() => { setForm(m); setModal('edit'); }}>✏️ Edit</button>
                                    <button className="btn-admin btn-admin-danger" style={{ marginLeft: 8 }} onClick={() => del(m.id)}>🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{modal === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}</h2>
                        <div className="admin-form">
                            <div className="form-group"><label>Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={form.categoryId || ''} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                                        <option value="">Select Category...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Brand (Optional)</label>
                                    <select value={form.brandId || ''} onChange={e => setForm({ ...form, brandId: e.target.value })}>
                                        <option value="">No Brand</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group"><label>Price (₹)</label><input type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', minHeight: 60 }} /></div>
                            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
                            <div className="form-row">
                                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <input type="checkbox" id="m_avail" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} />
                                    <label htmlFor="m_avail" style={{ marginBottom: 0 }}>Available</label>
                                </div>
                                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <input type="checkbox" id="m_veg" checked={form.isVeg} onChange={e => setForm({ ...form, isVeg: e.target.checked })} />
                                    <label htmlFor="m_veg" style={{ marginBottom: 0 }}>Veg</label>
                                </div>
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
        </div>
    );
}
