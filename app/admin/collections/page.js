'use client';
import { useState, useEffect } from 'react';

const empty = { title: '', image: '', description: '', menuItemIds: '[]' };

export default function AdminCollections() {
    const [items, setItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [selectedItems, setSelectedItems] = useState([]);
    const [toast, setToast] = useState('');
    const [search, setSearch] = useState('');

    const load = () => fetch('/api/admin/collections').then(r => r.json()).then(setItems);
    const loadMenu = () => fetch('/api/admin/menu').then(r => r.json()).then(setMenuItems);
    useEffect(() => { load(); loadMenu(); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const openAdd = () => {
        setForm(empty);
        setSelectedItems([]);
        setSearch('');
        setModal('add');
    };

    const openEdit = (c) => {
        setForm(c);
        setSearch('');
        try {
            setSelectedItems(JSON.parse(c.menuItemIds || '[]'));
        } catch {
            setSelectedItems([]);
        }
        setModal('edit');
    };

    const toggleItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const save = async () => {
        const body = {
            ...form,
            menuItemIds: JSON.stringify(selectedItems),
        };
        const method = modal === 'add' ? 'POST' : 'PUT';
        await fetch('/api/admin/collections', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        load();
        setModal(null);
        showToast(modal === 'add' ? 'Collection added!' : 'Collection updated!');
    };

    const del = async (id) => {
        if (!confirm('Delete this collection?')) return;
        await fetch(`/api/admin/collections?id=${id}`, { method: 'DELETE' });
        load();
        showToast('Collection deleted');
    };

    const filteredMenuItems = menuItems.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    const getSelectedItemNames = (idsJson) => {
        try {
            const ids = JSON.parse(idsJson || '[]');
            return ids.map(id => menuItems.find(m => m.id === id)?.name || id).join(', ');
        } catch { return ''; }
    };

    return (
        <>
            <div className="admin-header">
                <h1>📚 Collections</h1>
                <button className="btn-admin btn-admin-primary" onClick={openAdd}>+ Add Collection</button>
            </div>

            <div className="admin-card">
                <table className="admin-table">
                    <thead><tr><th>Image</th><th>Title</th><th>Description</th><th>Items</th><th>Actions</th></tr></thead>
                    <tbody>
                        {items.map(c => (
                            <tr key={c.id}>
                                <td><img src={c.image} alt={c.title} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} /></td>
                                <td><strong>{c.title}</strong></td>
                                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.85rem' }}>
                                    {c.description || '—'}
                                </td>
                                <td style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: 180 }}>
                                    {(() => {
                                        try { return JSON.parse(c.menuItemIds || '[]').length; } catch { return 0; }
                                    })()} items
                                </td>
                                <td className="admin-actions">
                                    <button className="btn-admin btn-admin-outline" onClick={() => openEdit(c)}>Edit</button>
                                    <button className="btn-admin btn-admin-danger" onClick={() => del(c.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
                        <h2>{modal === 'add' ? 'Add Collection' : 'Edit Collection'}</h2>
                        <div className="admin-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Weekend Specials" />
                            </div>
                            <div className="form-group">
                                <label>Cover Image URL</label>
                                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                                {form.image && (
                                    <img src={form.image} alt="Preview" style={{ marginTop: 8, width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                                )}
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe this collection..."
                                    rows={3}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>

                            {/* Menu Items selector */}
                            <div className="form-group">
                                <label>Menu Items ({selectedItems.length} selected)</label>
                                <input
                                    placeholder="Search menu items..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{ marginBottom: 8 }}
                                />
                                <div style={{
                                    maxHeight: 250, overflowY: 'auto', border: '1.5px solid #e2e8f0',
                                    borderRadius: 8, padding: 0
                                }}>
                                    {filteredMenuItems.map(mi => (
                                        <label
                                            key={mi.id}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '8px 12px', cursor: 'pointer',
                                                borderBottom: '1px solid #f1f5f9',
                                                background: selectedItems.includes(mi.id) ? '#eef2ff' : 'transparent',
                                                transition: 'background 0.15s'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(mi.id)}
                                                onChange={() => toggleItem(mi.id)}
                                                style={{ width: 16, height: 16, accentColor: '#4338ca' }}
                                            />
                                            {mi.image && (
                                                <img src={mi.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                                            )}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{mi.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>₹{mi.price} • {mi.isVeg ? 'Veg' : 'Non-Veg'}</div>
                                            </div>
                                        </label>
                                    ))}
                                    {filteredMenuItems.length === 0 && (
                                        <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                            No items found
                                        </div>
                                    )}
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
        </>
    );
}
