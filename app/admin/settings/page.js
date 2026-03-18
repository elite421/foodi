'use client';
import { useState, useEffect } from 'react';

export default function AdminSettings() {
    const [s, setS] = useState(null);
    const [toast, setToast] = useState('');
    const [activeTab, setActiveTab] = useState('general');
    const [deliveryRules, setDeliveryRules] = useState([]);
    const [additionalFees, setAdditionalFees] = useState([]);
    const [editingRule, setEditingRule] = useState(null);
    const [editingFee, setEditingFee] = useState(null);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [showFeeModal, setShowFeeModal] = useState(false);

    useEffect(() => { 
        fetch('/api/admin/settings').then(r => r.json()).then(data => {
            setS(data);
            setDeliveryRules(data.deliveryFeeRules || []);
            setAdditionalFees(data.additionalFees || []);
        }); 
    }, []);

    const save = async () => {
        const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
        if (res.ok) { setToast('Settings saved!'); setTimeout(() => setToast(''), 3000); }
        else { const d = await res.json(); setToast(d.error || 'Error'); }
    };

    const saveDeliveryRule = async (rule) => {
        const isNew = !rule.id || rule.id === 'new';
        const url = '/api/admin/delivery-fee-rules';
        const method = isNew ? 'POST' : 'PUT';
        
        const res = await fetch(url, { 
            method, 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(rule) 
        });
        
        if (res.ok) {
            const data = await res.json();
            if (isNew) {
                setDeliveryRules([...deliveryRules, data.rule]);
            } else {
                setDeliveryRules(deliveryRules.map(r => r.id === rule.id ? data.rule : r));
            }
            setShowRuleModal(false);
            setEditingRule(null);
            setToast(isNew ? 'Rule created!' : 'Rule updated!');
            setTimeout(() => setToast(''), 3000);
        } else {
            const d = await res.json();
            setToast(d.error || 'Error saving rule');
        }
    };

    const deleteDeliveryRule = async (id) => {
        if (!confirm('Delete this delivery fee rule?')) return;
        
        const res = await fetch(`/api/admin/delivery-fee-rules?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setDeliveryRules(deliveryRules.filter(r => r.id !== id));
            setToast('Rule deleted!');
            setTimeout(() => setToast(''), 3000);
        }
    };

    const saveAdditionalFee = async (fee) => {
        const isNew = !fee.id || fee.id === 'new';
        const url = '/api/admin/additional-fees';
        const method = isNew ? 'POST' : 'PUT';
        
        const res = await fetch(url, { 
            method, 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(fee) 
        });
        
        if (res.ok) {
            const data = await res.json();
            if (isNew) {
                setAdditionalFees([...additionalFees, data.fee]);
            } else {
                setAdditionalFees(additionalFees.map(f => f.id === fee.id ? data.fee : f));
            }
            setShowFeeModal(false);
            setEditingFee(null);
            setToast(isNew ? 'Fee created!' : 'Fee updated!');
            setTimeout(() => setToast(''), 3000);
        } else {
            const d = await res.json();
            setToast(d.error || 'Error saving fee');
        }
    };

    const deleteAdditionalFee = async (id) => {
        if (!confirm('Delete this additional fee?')) return;
        
        const res = await fetch(`/api/admin/additional-fees?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setAdditionalFees(additionalFees.filter(f => f.id !== id));
            setToast('Fee deleted!');
            setTimeout(() => setToast(''), 3000);
        }
    };

    if (!s) return <p>Loading...</p>;

    const F = ({ label, field, type, placeholder, min, max, step }) => (
        <div className="form-group">
            <label>{label}</label>
            <input 
                type={type || 'text'} 
                value={s[field] || ''} 
                onChange={e => setS({ ...s, [field]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );

    const getConditionTypeLabel = (type) => {
        const labels = {
            'ALWAYS': 'Always Apply',
            'MIN_ORDER': 'Minimum Order Value',
            'MAX_ORDER': 'Maximum Order Value',
            'DISTANCE': 'Distance Range',
            'TIME_RANGE': 'Time of Day',
            'DAY_OF_WEEK': 'Specific Days'
        };
        return labels[type] || type;
    };

    const getFeeTypeLabel = (type) => {
        const labels = {
            'FLAT': 'Flat Amount',
            'PERCENTAGE': 'Percentage of Order',
            'PER_KM': 'Per Kilometer',
            'TIERED': 'Tiered Pricing'
        };
        return labels[type] || type;
    };

    const getApplyToLabel = (type) => {
        const labels = {
            'ALL_ORDERS': 'All Orders',
            'ONLINE_PAYMENT': 'Online Payment Only',
            'COD': 'Cash on Delivery Only',
            'MIN_ORDER': 'Minimum Order Value'
        };
        return labels[type] || type;
    };

    return (
        <>
            <div className="admin-header">
                <h1>⚙️ Settings</h1>
                <button className="btn-admin btn-admin-primary" onClick={save}>Save Changes</button>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                {[
                    { id: 'general', label: '🏢 General' },
                    { id: 'delivery', label: '🚚 Delivery & Fees' },
                    { id: 'payment', label: '💳 Payment' },
                    { id: 'appearance', label: '🎨 Appearance' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            background: activeTab === tab.id ? '#4338ca' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            borderRadius: '8px 8px 0 0',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Settings Tab */}
            {activeTab === 'general' && (
                <>
                    <div className="admin-card">
                        <h3>Site Details</h3>
                        <div className="admin-form">
                            <div className="form-row">
                                <F label="Site Name" field="site_name" />
                                <F label="Tagline" field="tagline" />
                            </div>
                            <div className="form-row">
                                <F label="Domain" field="domain" />
                                <F label="Phone" field="phone" />
                            </div>
                            <div className="form-row">
                                <F label="Email" field="email" type="email" />
                                <F label="Address" field="address" />
                            </div>
                        </div>
                    </div>

                    <div className="admin-card">
                        <h3>Social Links</h3>
                        <div className="admin-form">
                            <div className="form-row">
                                <F label="Facebook" field="facebook" />
                                <F label="Instagram" field="instagram" />
                                <F label="Twitter" field="twitter" />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delivery & Fees Tab */}
            {activeTab === 'delivery' && (
                <>
                    {/* Basic Delivery Settings */}
                    <div className="admin-card">
                        <h3>🚚 Basic Delivery Settings</h3>
                        <div className="admin-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Delivery Radius (km)</label>
                                    <input type="number" step="0.1" value={s.deliveryRadius} onChange={e => setS({ ...s, deliveryRadius: parseFloat(e.target.value) || 0 })} />
                                    <small style={{ color: '#64748b' }}>Maximum distance for delivery from restaurant</small>
                                </div>
                                <div className="form-group">
                                    <label>Base Delivery Fee (₹)</label>
                                    <input type="number" step="0.5" value={s.baseDeliveryFee} onChange={e => setS({ ...s, baseDeliveryFee: parseFloat(e.target.value) || 0 })} />
                                    <small style={{ color: '#64748b' }}>Default fee when no rules match</small>
                                </div>
                                <div className="form-group">
                                    <label>Tax Percentage (%)</label>
                                    <input type="number" step="0.1" value={s.taxPercentage} onChange={e => setS({ ...s, taxPercentage: parseFloat(e.target.value) || 0 })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Free Delivery Threshold (₹)</label>
                                    <input type="number" step="10" value={s.freeDeliveryThreshold || 500} onChange={e => setS({ ...s, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })} />
                                    <small style={{ color: '#64748b' }}>Orders above this amount get free delivery</small>
                                </div>
                                <div className="form-group">
                                    <label>Minimum Order Amount (₹)</label>
                                    <input type="number" step="10" value={s.minOrderAmount || 100} onChange={e => setS({ ...s, minOrderAmount: parseFloat(e.target.value) || 0 })} />
                                    <small style={{ color: '#64748b' }}>Minimum order value to place an order</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Restaurant Location */}
                    <div className="admin-card">
                        <h3>📍 Restaurant Location Coordinates</h3>
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

                    {/* Delivery Fee Rules */}
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>📋 Delivery Fee Rules</h3>
                            <button 
                                className="btn-admin btn-admin-primary"
                                onClick={() => {
                                    setEditingRule({
                                        id: 'new',
                                        name: '',
                                        description: '',
                                        conditionType: 'ALWAYS',
                                        feeType: 'FLAT',
                                        feeValue: 40,
                                        priority: 0,
                                        isActive: true,
                                        daysOfWeek: []
                                    });
                                    setShowRuleModal(true);
                                }}
                            >
                                + Add Rule
                            </button>
                        </div>
                        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                            Create multiple delivery fee rules based on order value, distance, time, or day of week. Rules are checked in priority order.
                        </p>

                        {deliveryRules.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
                                <p style={{ color: '#64748b' }}>No delivery fee rules yet. Add your first rule!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {deliveryRules.map((rule, index) => (
                                    <div key={rule.id} style={{ 
                                        padding: '1rem', 
                                        background: rule.isActive ? '#f8fafc' : '#f1f5f9', 
                                        borderRadius: '12px',
                                        border: rule.isActive ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
                                        opacity: rule.isActive ? 1 : 0.7
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <strong>{rule.name || `Rule ${index + 1}`}</strong>
                                                    {!rule.isActive && <span style={{ fontSize: '0.75rem', background: '#94a3b8', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>Inactive</span>}
                                                    <span style={{ fontSize: '0.75rem', background: '#4338ca', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>Priority: {rule.priority}</span>
                                                </div>
                                                <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                                                    {getConditionTypeLabel(rule.conditionType)} → {getFeeTypeLabel(rule.feeType)}: 
                                                    {rule.feeType === 'PERCENTAGE' ? `${rule.feePercentage}%` : `₹${rule.feeValue}`}
                                                </p>
                                                {rule.description && <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{rule.description}</p>}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    className="btn-admin"
                                                    onClick={() => {
                                                        setEditingRule({...rule, daysOfWeek: Array.isArray(rule.daysOfWeek) ? rule.daysOfWeek : JSON.parse(rule.daysOfWeek || '[]')});
                                                        setShowRuleModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn-admin btn-admin-danger"
                                                    onClick={() => deleteDeliveryRule(rule.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Additional Fees */}
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>💰 Additional Fees</h3>
                            <button 
                                className="btn-admin btn-admin-primary"
                                onClick={() => {
                                    setEditingFee({
                                        id: 'new',
                                        name: '',
                                        description: '',
                                        applyTo: 'ALL_ORDERS',
                                        feeType: 'FLAT',
                                        feeValue: 0,
                                        isTaxable: false,
                                        showInBreakdown: true,
                                        priority: 0,
                                        isActive: false
                                    });
                                    setShowFeeModal(true);
                                }}
                            >
                                + Add Fee
                            </button>
                        </div>
                        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                            Add extra fees like service charges, packaging fees, or handling fees. These can be applied based on payment method or order value.
                        </p>

                        {additionalFees.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
                                <p style={{ color: '#64748b' }}>No additional fees yet. Add your first fee!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {additionalFees.map((fee, index) => (
                                    <div key={fee.id} style={{ 
                                        padding: '1rem', 
                                        background: fee.isActive ? '#f8fafc' : '#f1f5f9', 
                                        borderRadius: '12px',
                                        border: fee.isActive ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
                                        opacity: fee.isActive ? 1 : 0.7
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <strong>{fee.name || `Fee ${index + 1}`}</strong>
                                                    {!fee.isActive && <span style={{ fontSize: '0.75rem', background: '#94a3b8', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>Inactive</span>}
                                                    {fee.isTaxable && <span style={{ fontSize: '0.75rem', background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>Taxable</span>}
                                                </div>
                                                <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                                                    {getApplyToLabel(fee.applyTo)} → {fee.feeType === 'PERCENTAGE' ? `${fee.feePercentage}%` : `₹${fee.feeValue}`}
                                                </p>
                                                {fee.description && <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{fee.description}</p>}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    className="btn-admin"
                                                    onClick={() => {
                                                        setEditingFee({...fee});
                                                        setShowFeeModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn-admin btn-admin-danger"
                                                    onClick={() => deleteAdditionalFee(fee.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
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
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
                <div className="admin-card">
                    <h3>Theme Colors</h3>
                    <div className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Primary Color</label>
                                <input type="color" value={s.primary_color || '#4338ca'} onChange={e => setS({ ...s, primary_color: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Secondary Color</label>
                                <input type="color" value={s.secondary_color || '#f59e0b'} onChange={e => setS({ ...s, secondary_color: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delivery Fee Rule Modal */}
            {showRuleModal && editingRule && (
                <DeliveryFeeRuleModal 
                    rule={editingRule}
                    onSave={saveDeliveryRule}
                    onClose={() => { setShowRuleModal(false); setEditingRule(null); }}
                />
            )}

            {/* Additional Fee Modal */}
            {showFeeModal && editingFee && (
                <AdditionalFeeModal 
                    fee={editingFee}
                    onSave={saveAdditionalFee}
                    onClose={() => { setShowFeeModal(false); setEditingFee(null); }}
                />
            )}

            {toast && <div className="toast">{toast}</div>}
        </>
    );
}

// Delivery Fee Rule Modal Component
function DeliveryFeeRuleModal({ rule, onSave, onClose }) {
    const [formData, setFormData] = useState(rule);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const toggleDay = (dayIndex) => {
        const currentDays = formData.daysOfWeek || [];
        const newDays = currentDays.includes(dayIndex)
            ? currentDays.filter(d => d !== dayIndex)
            : [...currentDays, dayIndex].sort();
        setFormData({ ...formData, daysOfWeek: newDays });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <h2 style={{ marginTop: 0 }}>{formData.id === 'new' ? 'Add Delivery Fee Rule' : 'Edit Delivery Fee Rule'}</h2>
                
                <div className="admin-form">
                    <div className="form-group">
                        <label>Rule Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Standard Delivery, Peak Hours" />
                    </div>

                    <div className="form-group">
                        <label>Description (optional)</label>
                        <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description of this rule" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Condition Type</label>
                            <select value={formData.conditionType} onChange={e => setFormData({...formData, conditionType: e.target.value})}>
                                <option value="ALWAYS">Always Apply</option>
                                <option value="MIN_ORDER">Minimum Order Value</option>
                                <option value="MAX_ORDER">Maximum Order Value</option>
                                <option value="DISTANCE">Distance Range</option>
                                <option value="TIME_RANGE">Time of Day</option>
                                <option value="DAY_OF_WEEK">Specific Days</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fee Type</label>
                            <select value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})}>
                                <option value="FLAT">Flat Amount</option>
                                <option value="PERCENTAGE">Percentage of Order</option>
                                <option value="PER_KM">Per Kilometer</option>
                                <option value="TIERED">Tiered Pricing</option>
                            </select>
                        </div>
                    </div>

                    {(formData.conditionType === 'MIN_ORDER' || formData.conditionType === 'MAX_ORDER') && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Min Order Value (₹)</label>
                                <input type="number" value={formData.minOrderValue || ''} onChange={e => setFormData({...formData, minOrderValue: parseFloat(e.target.value) || null})} />
                            </div>
                            <div className="form-group">
                                <label>Max Order Value (₹)</label>
                                <input type="number" value={formData.maxOrderValue || ''} onChange={e => setFormData({...formData, maxOrderValue: parseFloat(e.target.value) || null})} />
                            </div>
                        </div>
                    )}

                    {formData.conditionType === 'DISTANCE' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Min Distance (km)</label>
                                <input type="number" step="0.1" value={formData.minDistance || ''} onChange={e => setFormData({...formData, minDistance: parseFloat(e.target.value) || null})} />
                            </div>
                            <div className="form-group">
                                <label>Max Distance (km)</label>
                                <input type="number" step="0.1" value={formData.maxDistance || ''} onChange={e => setFormData({...formData, maxDistance: parseFloat(e.target.value) || null})} />
                            </div>
                        </div>
                    )}

                    {formData.conditionType === 'TIME_RANGE' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Time</label>
                                <input type="time" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input type="time" value={formData.endTime || ''} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {formData.conditionType === 'DAY_OF_WEEK' && (
                        <div className="form-group">
                            <label>Applicable Days</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {days.map((day, idx) => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(idx)}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            background: (formData.daysOfWeek || []).includes(idx) ? '#4338ca' : 'white',
                                            color: (formData.daysOfWeek || []).includes(idx) ? 'white' : '#0f172a',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {formData.feeType === 'FLAT' && (
                        <div className="form-group">
                            <label>Flat Fee Amount (₹)</label>
                            <input type="number" step="0.5" value={formData.feeValue} onChange={e => setFormData({...formData, feeValue: parseFloat(e.target.value) || 0})} />
                        </div>
                    )}

                    {formData.feeType === 'PERCENTAGE' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Percentage (%)</label>
                                <input type="number" step="0.1" value={formData.feePercentage || ''} onChange={e => setFormData({...formData, feePercentage: parseFloat(e.target.value) || null})} />
                            </div>
                            <div className="form-group">
                                <label>Maximum Fee (₹)</label>
                                <input type="number" value={formData.maxFee || ''} onChange={e => setFormData({...formData, maxFee: parseFloat(e.target.value) || null})} placeholder="Optional cap" />
                            </div>
                        </div>
                    )}

                    {formData.feeType === 'PER_KM' && (
                        <div className="form-group">
                            <label>Per KM Rate (₹)</label>
                            <input type="number" step="0.5" value={formData.perKmRate || ''} onChange={e => setFormData({...formData, perKmRate: parseFloat(e.target.value) || null})} />
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <input type="number" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value) || 0})} />
                            <small style={{ color: '#64748b' }}>Higher number = checked first</small>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                                Active
                            </label>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn-admin btn-admin-primary" onClick={() => onSave(formData)}>
                        Save Rule
                    </button>
                    <button className="btn-admin" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// Additional Fee Modal Component
function AdditionalFeeModal({ fee, onSave, onClose }) {
    const [formData, setFormData] = useState(fee);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <h2 style={{ marginTop: 0 }}>{formData.id === 'new' ? 'Add Additional Fee' : 'Edit Additional Fee'}</h2>
                
                <div className="admin-form">
                    <div className="form-group">
                        <label>Fee Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Service Charge, Packaging Fee" />
                    </div>

                    <div className="form-group">
                        <label>Description (optional)</label>
                        <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Apply To</label>
                            <select value={formData.applyTo} onChange={e => setFormData({...formData, applyTo: e.target.value})}>
                                <option value="ALL_ORDERS">All Orders</option>
                                <option value="ONLINE_PAYMENT">Online Payment Only</option>
                                <option value="COD">Cash on Delivery Only</option>
                                <option value="MIN_ORDER">Minimum Order Value</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fee Type</label>
                            <select value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})}>
                                <option value="FLAT">Flat Amount</option>
                                <option value="PERCENTAGE">Percentage of Order</option>
                            </select>
                        </div>
                    </div>

                    {formData.applyTo === 'MIN_ORDER' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Min Order Value (₹)</label>
                                <input type="number" value={formData.minOrderValue || ''} onChange={e => setFormData({...formData, minOrderValue: parseFloat(e.target.value) || null})} />
                            </div>
                            <div className="form-group">
                                <label>Max Order Value (₹)</label>
                                <input type="number" value={formData.maxOrderValue || ''} onChange={e => setFormData({...formData, maxOrderValue: parseFloat(e.target.value) || null})} placeholder="Optional" />
                            </div>
                        </div>
                    )}

                    {formData.feeType === 'FLAT' ? (
                        <div className="form-group">
                            <label>Fee Amount (₹)</label>
                            <input type="number" step="0.5" value={formData.feeValue} onChange={e => setFormData({...formData, feeValue: parseFloat(e.target.value) || 0})} />
                        </div>
                    ) : (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Percentage (%)</label>
                                <input type="number" step="0.1" value={formData.feePercentage || ''} onChange={e => setFormData({...formData, feePercentage: parseFloat(e.target.value) || null})} />
                            </div>
                            <div className="form-group">
                                <label>Minimum Fee (₹)</label>
                                <input type="number" value={formData.minFee || ''} onChange={e => setFormData({...formData, minFee: parseFloat(e.target.value) || null})} placeholder="Optional" />
                            </div>
                            <div className="form-group">
                                <label>Maximum Fee (₹)</label>
                                <input type="number" value={formData.maxFee || ''} onChange={e => setFormData({...formData, maxFee: parseFloat(e.target.value) || null})} placeholder="Optional" />
                            </div>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.isTaxable} onChange={e => setFormData({...formData, isTaxable: e.target.checked})} />
                                Taxable (GST applicable)
                            </label>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.showInBreakdown} onChange={e => setFormData({...formData, showInBreakdown: e.target.checked})} />
                                Show in Bill Breakdown
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                            Active (Enable this fee)
                        </label>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn-admin btn-admin-primary" onClick={() => onSave(formData)}>
                        Save Fee
                    </button>
                    <button className="btn-admin" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
