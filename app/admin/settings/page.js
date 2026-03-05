'use client';
import { useState, useEffect } from 'react';

export default function AdminSettings() {
    const [s, setS] = useState(null);
    const [toast, setToast] = useState('');
    useEffect(() => { fetch('/api/admin/settings').then(r => r.json()).then(setS); }, []);

    const save = async () => {
        const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
        if (res.ok) { setToast('Settings saved!'); setTimeout(() => setToast(''), 3000); }
        else { const d = await res.json(); setToast(d.error || 'Error'); }
    };

    if (!s) return <p>Loading...</p>;
    const F = ({ label, field, type }) => (
        <div className="form-group">
            <label>{label}</label>
            <input type={type || 'text'} value={s[field] || ''} onChange={e => setS({ ...s, [field]: e.target.value })} />
        </div>
    );
    return (
        <>
            <div className="admin-header">
                <h1>⚙️ Settings</h1>
                <button className="btn-admin btn-admin-primary" onClick={save}>Save Changes</button>
            </div>
            <div className="admin-card">
                <h3>Site Details</h3>
                <div className="admin-form">
                    <div className="form-row"><F label="Site Name" field="site_name" /><F label="Tagline" field="tagline" /></div>
                    <div className="form-row"><F label="Domain" field="domain" /><F label="Phone" field="phone" /></div>
                    <div className="form-row"><F label="Email" field="email" type="email" /><F label="Address" field="address" /></div>
                </div>
            </div>
            <div className="admin-card">
                <h3>Social Links</h3>
                <div className="admin-form">
                    <F label="Facebook" field="facebook" /><F label="Instagram" field="instagram" /><F label="Twitter" field="twitter" />
                </div>
            </div>

            <div className="admin-card">
                <h3>Delivery & Taxes</h3>
                <div className="admin-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Delivery Radius (km)</label>
                            <input type="number" step="0.1" value={s.deliveryRadius} onChange={e => setS({ ...s, deliveryRadius: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <div className="form-group">
                            <label>Base Delivery Fee (₹)</label>
                            <input type="number" step="0.5" value={s.baseDeliveryFee} onChange={e => setS({ ...s, baseDeliveryFee: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <div className="form-group">
                            <label>Tax Percentage (%)</label>
                            <input type="number" step="0.1" value={s.taxPercentage} onChange={e => setS({ ...s, taxPercentage: parseFloat(e.target.value) || 0 })} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <h3>Restaurant Location Coordinates</h3>
                <div className="admin-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Latitude</label>
                            <input type="number" step="0.000001" value={s.restaurantLat} onChange={e => setS({ ...s, restaurantLat: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <div className="form-group">
                            <label>Longitude</label>
                            <input type="number" step="0.000001" value={s.restaurantLng} onChange={e => setS({ ...s, restaurantLng: parseFloat(e.target.value) || 0 })} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="admin-card">
                <h3>Theme Colors</h3>
                <div className="admin-form">
                    <div className="form-row">
                        <div className="form-group"><label>Primary</label><input type="color" value={s.primary_color || '#4338ca'} onChange={e => setS({ ...s, primary_color: e.target.value })} /></div>
                        <div className="form-group"><label>Secondary</label><input type="color" value={s.secondary_color || '#f59e0b'} onChange={e => setS({ ...s, secondary_color: e.target.value })} /></div>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <h3>Payment Gateway (Razorpay)</h3>
                <div className="admin-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Key ID</label>
                            <input type="text" placeholder="rzp_test_..." value={s.razorpayKeyId || ''} onChange={e => setS({ ...s, razorpayKeyId: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Key Secret</label>
                            <input type="password" placeholder="Secret" value={s.razorpayKeySecret || ''} onChange={e => setS({ ...s, razorpayKeySecret: e.target.value })} />
                        </div>
                    </div>
                </div>
            </div>
            {toast && <div className="toast">{toast}</div>}
        </>
    );
}
