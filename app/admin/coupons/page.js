'use client';
import { useState, useEffect } from 'react';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        const res = await fetch('/api/admin/coupons');
        if (res.ok) setCoupons(await res.json());
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const url = form.id ? '/api/admin/coupons' : '/api/admin/coupons';
        const method = form.id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method, headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const d = await res.json();
        if (d.success) { setModal(false); load(); } else alert(d.error);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete coupon?')) return;
        const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
        if (res.ok) load();
    };

    const openModal = (c = null) => {
        if (c) {
            setForm({ ...c });
        } else {
            setForm({
                code: '', discountType: 'PERCENTAGE', discountValue: 10,
                minOrderValue: 0, maxDiscount: null, isActive: true
            });
        }
        setModal(true);
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="admin-h1">Manage Coupons</h1>
                <button className="btn-admin btn-admin-primary" onClick={() => openModal()}>Add Coupon</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Min Order (₹)</th>
                            <th>Max Discount (₹)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(c => (
                            <tr key={c.id}>
                                <td><strong style={{ fontSize: '1.1rem' }}>{c.code}</strong></td>
                                <td>{c.discountValue}{c.discountType === 'PERCENTAGE' ? '%' : '₹'}</td>
                                <td>₹{c.minOrderValue}</td>
                                <td>{c.maxDiscount ? `₹${c.maxDiscount}` : '-'}</td>
                                <td>
                                    <span style={{ color: c.isActive ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                        {c.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-action edit" onClick={() => openModal(c)}>✏️</button>
                                        <button className="btn-action delete" onClick={() => handleDelete(c.id)}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{form.id ? 'Edit Coupon' : 'Add Coupon'}</h2>
                        <form onSubmit={handleSave} className="admin-form">
                            <div className="form-group">
                                <label>Code (Uppercase letters & numbers)</label>
                                <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FLAT">Flat Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Value</label>
                                    <input type="number" step="0.5" required value={form.discountValue} onChange={e => setForm({ ...form, discountValue: parseFloat(e.target.value) })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Min Order Value (₹)</label>
                                    <input type="number" required value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: parseFloat(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label>Max Discount Cap (₹) (Optional)</label>
                                    <input type="number" value={form.maxDiscount || ''} onChange={e => setForm({ ...form, maxDiscount: e.target.value ? parseFloat(e.target.value) : null })} />
                                </div>
                            </div>
                            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <input type="checkbox" id="c_active" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                                <label htmlFor="c_active" style={{ marginBottom: 0 }}>Active</label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-admin btn-admin-danger" onClick={() => setModal(false)}>Cancel</button>
                                <button type="submit" className="btn-admin btn-admin-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
