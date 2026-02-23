'use client';
import { useState, useEffect } from 'react';

const empty = { name: '', icon: '', image: '' };

export default function AdminCategories() {
    const [items, setItems] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [toast, setToast] = useState('');

    const load = () => fetch('/api/admin/categories').then(r => r.json()).then(setItems);
    useEffect(() => { load(); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const save = async () => {
        const method = modal === 'add' ? 'POST' : 'PUT';
        await fetch('/api/admin/categories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        load(); setModal(null); showToast(modal === 'add' ? 'Category added!' : 'Category updated!');
    };

    const del = async (id) => {
        if (!confirm('Delete this category?')) return;
        await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
        load(); showToast('Category deleted');
    };

    return (
        <>
            <div className="admin-header">
                <h1>📂 Categories</h1>
                <button className="btn-admin btn-admin-primary" onClick={() => { setForm(empty); setModal('add'); }}>+ Add Category</button>
            </div>
            <div className="admin-card">
                <table className="admin-table">
                    <thead><tr><th>Image</th><th>Icon</th><th>Name</th><th>Actions</th></tr></thead>
                    <tbody>
                        {items.map(c => (
                            <tr key={c.id}>
                                <td><img src={c.image} alt={c.name} /></td>
                                <td style={{ fontSize: '1.5rem' }}>{c.icon}</td>
                                <td>{c.name}</td>
                                <td className="admin-actions">
                                    <button className="btn-admin btn-admin-outline" onClick={() => { setForm(c); setModal('edit'); }}>Edit</button>
                                    <button className="btn-admin btn-admin-danger" onClick={() => del(c.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{modal === 'add' ? 'Add Category' : 'Edit Category'}</h2>
                        <div className="admin-form">
                            <div className="form-row">
                                <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                <div className="form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
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
