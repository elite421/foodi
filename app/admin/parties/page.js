'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const emptyParty = { 
    name: '', 
    description: '', 
    image: '',
    date: '',
    venue: '', 
    maxGuests: 50, 
    isActive: true 
};

export default function AdminParties() {
    const [parties, setParties] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyParty);
    const [selectedItems, setSelectedItems] = useState([]);
    const [toast, setToast] = useState('');

    const load = async () => {
        const [partiesRes, menuRes] = await Promise.all([
            fetch('/api/admin/parties'),
            fetch('/api/admin/menu')
        ]);
        if (partiesRes.ok) setParties(await partiesRes.json());
        if (menuRes.ok) setMenuItems(await menuRes.json());
    };

    useEffect(() => { load(); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const save = async () => {
        const payload = {
            ...form,
            date: form.date ? new Date(form.date).toISOString() : null,
            partyItems: selectedItems.filter(item => item.menuItemId && item.quantity > 0)
        };
        
        const method = modal === 'add' ? 'POST' : 'PUT';
        const res = await fetch('/api/admin/parties', {
            method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        
        if (res.ok) { 
            load(); 
            setModal(null); 
            showToast(modal === 'add' ? 'Party created!' : 'Party updated!'); 
        }
        else { 
            const d = await res.json(); 
            showToast(d.error || 'Error'); 
        }
    };

    const del = async (id) => {
        if (!confirm('Delete this party?')) return;
        await fetch(`/api/admin/parties?id=${id}`, { method: 'DELETE' });
        load(); showToast('Party deleted');
    };

    const addItemToParty = () => {
        setSelectedItems([...selectedItems, { menuItemId: '', quantity: 1, price: 0 }]);
    };

    const updateItem = (index, field, value) => {
        const updated = [...selectedItems];
        updated[index] = { ...updated[index], [field]: value };
        if (field === 'menuItemId') {
            const menuItem = menuItems.find(m => m.id === value);
            if (menuItem) updated[index].price = menuItem.price;
        }
        setSelectedItems(updated);
    };

    const removeItem = (index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const openEdit = (party) => {
        setForm({
            ...party,
            date: party.date ? new Date(party.date).toISOString().slice(0, 16) : ''
        });
        setSelectedItems(party.partyItems?.map(pi => ({
            menuItemId: pi.menuItemId,
            quantity: pi.quantity,
            price: pi.price
        })) || []);
        setModal('edit');
    };

    const calculateTotal = () => {
        return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>🎉 Parties & Events</h1>
                <button className="btn-admin btn-admin-primary" onClick={() => { 
                    setForm(emptyParty); 
                    setSelectedItems([]);
                    setModal('add'); 
                }}>+ Add Party</button>
            </div>
            
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Party Name</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parties.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <strong>{p.name}</strong>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.description?.slice(0, 50)}...</div>
                                </td>
                                <td>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                                <td>{p.venue || '-'}</td>
                                <td>{p.partyItems?.length || 0} items</td>
                                <td>
                                    <span style={{ 
                                        background: p.isActive ? '#dcfce7' : '#fee2e2', 
                                        color: p.isActive ? '#166534' : '#991b1b',
                                        padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem'
                                    }}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="admin-actions">
                                    <button className="btn-admin btn-admin-outline" onClick={() => openEdit(p)}>Edit</button>
                                    <button className="btn-admin btn-admin-danger" style={{ marginLeft: 8 }} onClick={() => del(p.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 800, maxHeight: '90vh', overflow: 'auto' }}>
                        <h2>{modal === 'add' ? 'Create Party' : 'Edit Party'}</h2>
                        
                        <div className="admin-form">
                            <div className="form-group"><label>Party Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            
                            <div className="form-row">
                                <div className="form-group"><label>Date & Time</label><input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                                <div className="form-group"><label>Venue</label><input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Location/Address" /></div>
                                <div className="form-group"><label>Max Guests</label><input type="number" value={form.maxGuests} onChange={e => setForm({ ...form, maxGuests: parseInt(e.target.value) || 50 })} /></div>
                            </div>
                            
                            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ minHeight: 60 }} /></div>
                            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
                            
                            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <input type="checkbox" id="party_active" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                                <label htmlFor="party_active" style={{ marginBottom: 0 }}>Active (Visible to users)</label>
                            </div>
                            
                            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>Menu Items</h3>
                                <button className="btn-admin btn-admin-outline" onClick={addItemToParty}>+ Add Item</button>
                            </div>
                            
                            {selectedItems.length === 0 && (
                                <p style={{ color: '#64748b', fontStyle: 'italic' }}>No items added yet. Click "Add Item" to include menu items.</p>
                            )}
                            
                            {selectedItems.map((item, index) => (
                                <div key={index} className="form-row" style={{ alignItems: 'flex-end', marginBottom: 10 }}>
                                    <div className="form-group" style={{ flex: 3 }}>
                                        <label>Menu Item</label>
                                        <select value={item.menuItemId} onChange={e => updateItem(index, 'menuItemId', e.target.value)}>
                                            <option value="">Select item...</option>
                                            {menuItems.map(m => (
                                                <option key={m.id} value={m.id}>{m.name} - ₹{m.price}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Quantity</label>
                                        <input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Price (₹)</label>
                                        <input type="number" value={item.price} onChange={e => updateItem(index, 'price', parseFloat(e.target.value) || 0)} />
                                    </div>
                                    <button className="btn-admin btn-admin-danger" onClick={() => removeItem(index)} style={{ marginBottom: 8 }}>Remove</button>
                                </div>
                            ))}
                            
                            {selectedItems.length > 0 && (
                                <div style={{ textAlign: 'right', padding: '10px', background: '#f8fafc', borderRadius: 8, marginTop: 10 }}>
                                    <strong>Total Estimate: ₹{calculateTotal().toFixed(2)}</strong>
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-actions">
                            <button className="btn-admin btn-admin-outline" onClick={() => setModal(null)}>Cancel</button>
                            <button className="btn-admin btn-admin-primary" onClick={save}>Save Party</button>
                        </div>
                    </div>
                </div>
            )}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
