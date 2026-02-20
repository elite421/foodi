'use client';
import { useState, useEffect } from 'react';

const empty = { title: '', image: '', link: '/menu' };

export default function AdminCollections() {
    const [items, setItems] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [toast, setToast] = useState('');

    const load = () => fetch('/api/admin/collections').then(r => r.json()).then(setItems);
    useEffect(() => { load(); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const save = async () => {
        const method = modal === 'add' ? 'POST' : 'PUT';
        await fetch('/api/admin/collections', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        load(); setModal(null); showToast(modal === 'add' ? 'Collection added!' : 'Collection updated!');
    };

    const del = async (id) => {
        if (!confirm('Delete this collection?')) return;
        await fetch(`/api/admin/collections?id=${id}`, { method: 'DELETE' });
        load(); showToast('Collection deleted');
    };

    return (
        <>
            <div className="admin-header">
                <h1>📚 Collections</h1>
                <button className="btn-admin btn-admin-primary" onClick={() => { setForm(empty); setModal('add'); }}>+ Add Collection</button>
            </div>
            <div className="admin-card">
                <table className="admin-table">
                    <thead><tr><th>Image</th><th>Title</th><th>Link</th><th>Actions</th></tr></thead>
                    <tbody>
                        {items.map(c => (
                            <tr key={c.id}>
                                <td><img src={c.image} alt={c.title} /></td>
                                <td>{c.title}</td>
                                <td>{c.link}</td>
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
                        <h2>{modal === 'add' ? 'Add Collection' : 'Edit Collection'}</h2>
                        <div className="admin-form">
                            <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
                            <div className="form-group"><label>Link</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} /></div>
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
