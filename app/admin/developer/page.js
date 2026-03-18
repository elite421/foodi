'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DeveloperPage() {
    const [activeTab, setActiveTab] = useState('api');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [systemInfo, setSystemInfo] = useState(null);
    const [apiKeys, setApiKeys] = useState([]);
    const [showNewKeyModal, setShowNewKeyModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyPermissions, setNewKeyPermissions] = useState(['read']);
    const [generatedKey, setGeneratedKey] = useState(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchSettings();
        fetchSystemInfo();
        fetchApiKeys();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.success) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApiKeys = async () => {
        try {
            const res = await fetch('/api/admin/developer/api-keys');
            const data = await res.json();
            if (data.success) {
                setApiKeys(data.apiKeys);
            }
        } catch (error) {
            console.error('Error fetching API keys:', error);
        }
    };

    const generateApiKey = async () => {
        if (!newKeyName.trim()) {
            setMessage('❌ Please enter a name for the API key');
            return;
        }
        setGenerating(true);
        try {
            const res = await fetch('/api/admin/developer/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName, permissions: newKeyPermissions })
            });
            const data = await res.json();
            if (data.success) {
                setGeneratedKey(data.apiKey);
                setMessage('✅ API key generated successfully');
                fetchApiKeys();
            } else {
                setMessage('❌ Error: ' + data.error);
            }
        } catch (error) {
            setMessage('❌ Error generating API key');
        } finally {
            setGenerating(false);
        }
    };

    const revokeApiKey = async (id) => {
        if (!confirm('Are you sure you want to revoke this API key?')) return;
        try {
            const res = await fetch('/api/admin/developer/api-keys', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setMessage('✅ API key revoked successfully');
                fetchApiKeys();
            } else {
                setMessage('❌ Error: ' + data.error);
            }
        } catch (error) {
            setMessage('❌ Error revoking API key');
        }
    };

    const toggleApiKeyStatus = async (id, isActive) => {
        try {
            const res = await fetch('/api/admin/developer/api-keys', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !isActive })
            });
            const data = await res.json();
            if (data.success) {
                setMessage('✅ API key updated successfully');
                fetchApiKeys();
            } else {
                setMessage('❌ Error: ' + data.error);
            }
        } catch (error) {
            setMessage('❌ Error updating API key');
        }
    };

    const fetchSystemInfo = async () => {
        try {
            const res = await fetch('/api/admin/developer/system-info');
            const data = await res.json();
            if (data.success) {
                setSystemInfo(data.info);
            }
        } catch (error) {
            console.error('Error fetching system info:', error);
        }
    };

    const handleSave = async (section, data) => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/developer/update-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section, data })
            });
            const result = await res.json();
            if (result.success) {
                setMessage('✅ Settings saved successfully');
                fetchSettings();
            } else {
                setMessage('❌ Error: ' + result.error);
            }
        } catch (error) {
            setMessage('❌ Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleClearCache = async () => {
        if (!confirm('Are you sure you want to clear all caches?')) return;
        
        try {
            const res = await fetch('/api/admin/developer/clear-cache', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setMessage('✅ Cache cleared successfully');
            } else {
                setMessage('❌ Error clearing cache');
            }
        } catch (error) {
            setMessage('❌ Error clearing cache');
        }
    };

    const handleRevalidate = async () => {
        try {
            const res = await fetch('/api/admin/developer/revalidate', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setMessage('✅ Pages revalidated successfully');
            } else {
                setMessage('❌ Error revalidating pages');
            }
        } catch (error) {
            setMessage('❌ Error revalidating pages');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none' }}>← Back</Link>
                    <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Developer Tools</h1>
                </div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none' }}>← Back</Link>
                <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Developer Tools</h1>
            </div>

            {message && (
                <div style={{ 
                    padding: '1rem', 
                    marginBottom: '1.5rem', 
                    background: message.includes('✅') ? '#dcfce7' : '#fee2e2',
                    color: message.includes('✅') ? '#166534' : '#991b1b',
                    borderRadius: '8px',
                    fontWeight: 600
                }}>
                    {message}
                </div>
            )}

            {/* Tab Navigation */}
            <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '2rem',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '0.5rem'
            }}>
                {[
                    { id: 'api', label: 'API & Keys', icon: '🔑' },
                    { id: 'integration', label: 'Integration API', icon: '🔌' },
                    { id: 'webhooks', label: 'Webhooks', icon: '🪝' },
                    { id: 'database', label: 'Database', icon: '🗄️' },
                    { id: 'system', label: 'System Info', icon: 'ℹ️' },
                    { id: 'tools', label: 'Tools', icon: '🛠️' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px 8px 0 0',
                            border: 'none',
                            background: activeTab === tab.id ? '#4338ca' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* API & Keys Tab */}
            {activeTab === 'api' && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>API Configuration</h2>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: '#4338ca', marginBottom: '1rem' }}>Razorpay Settings</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Key ID</label>
                                <input
                                    type="text"
                                    value={settings?.razorpayKeyId || ''}
                                    onChange={(e) => setSettings({...settings, razorpayKeyId: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="rzp_test_..."
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Key Secret</label>
                                <input
                                    type="password"
                                    value={settings?.razorpayKeySecret || ''}
                                    onChange={(e) => setSettings({...settings, razorpayKeySecret: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="Enter secret key"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Webhook Secret</label>
                                <input
                                    type="password"
                                    value={settings?.razorpayWebhookSecret || ''}
                                    onChange={(e) => setSettings({...settings, razorpayWebhookSecret: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="Enter webhook secret"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: '#4338ca', marginBottom: '1rem' }}>MSG91 SMS Settings</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Auth Key</label>
                                <input
                                    type="password"
                                    value={settings?.msg91AuthKey || ''}
                                    onChange={(e) => setSettings({...settings, msg91AuthKey: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="Enter MSG91 auth key"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>OTP Template ID</label>
                                <input
                                    type="text"
                                    value={settings?.msg91OtpTemplateId || ''}
                                    onChange={(e) => setSettings({...settings, msg91OtpTemplateId: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="Enter template ID"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Sender ID</label>
                                <input
                                    type="text"
                                    value={settings?.msg91SenderId || ''}
                                    onChange={(e) => setSettings({...settings, msg91SenderId: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="FDCOTP"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSave('api', {
                            razorpayKeyId: settings?.razorpayKeyId,
                            razorpayKeySecret: settings?.razorpayKeySecret,
                            razorpayWebhookSecret: settings?.razorpayWebhookSecret,
                            msg91AuthKey: settings?.msg91AuthKey,
                            msg91OtpTemplateId: settings?.msg91OtpTemplateId,
                            msg91SenderId: settings?.msg91SenderId
                        })}
                        disabled={saving}
                        style={{
                            padding: '0.75rem 2rem',
                            background: '#4338ca',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? 'Saving...' : '💾 Save API Settings'}
                    </button>
                </div>
            )}

            {/* Integration API Tab */}
            {activeTab === 'integration' && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>🔌 Integration API Keys</h2>
                        <button
                            onClick={() => {
                                setShowNewKeyModal(true);
                                setGeneratedKey(null);
                                setNewKeyName('');
                                setNewKeyPermissions(['read']);
                            }}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#4338ca',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            + Generate New API Key
                        </button>
                    </div>

                    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>📖 API Documentation</h4>
                        <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>
                            Use these endpoints to integrate with external systems. Include your API key in the 
                            <code style={{ background: '#e2e8f0', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>X-API-Key</code> header or 
                            <code style={{ background: '#e2e8f0', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Authorization: Bearer &lt;key&gt;</code> header.
                        </p>
                        <div style={{ marginTop: '1rem' }}>
                            <code style={{ display: 'block', padding: '0.75rem', background: '#0f172a', color: '#22c55e', borderRadius: '6px', fontSize: '0.85rem' }}>
                                GET /api/external/menu - Get menu items<br/>
                                GET /api/external/categories - Get categories<br/>
                                GET /api/external/orders - Get orders (requires 'orders' permission)<br/>
                                POST /api/external/orders - Create order (requires 'write' permission)
                            </code>
                        </div>
                    </div>

                    {generatedKey && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fef3c7', borderRadius: '8px', border: '2px solid #f59e0b' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#92400e' }}>🔑 New API Key Generated</h4>
                            <p style={{ margin: '0 0 0.5rem 0', color: '#92400e', fontSize: '0.9rem' }}>
                                Copy this key now. You won&apos;t be able to see it again!
                            </p>
                            <code style={{ 
                                display: 'block', 
                                padding: '1rem', 
                                background: '#0f172a', 
                                color: '#22c55e', 
                                borderRadius: '6px', 
                                fontFamily: 'monospace',
                                wordBreak: 'break-all',
                                fontSize: '0.9rem'
                            }}>
                                {generatedKey.key}
                            </code>
                            <button
                                onClick={() => setGeneratedKey(null)}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    background: '#f59e0b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                I&apos;ve Copied the Key
                            </button>
                        </div>
                    )}

                    {showNewKeyModal && !generatedKey && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 1rem 0' }}>Generate New API Key</h4>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Key Name</label>
                                <input
                                    type="text"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    placeholder="e.g., POS System Integration"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Permissions</label>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {['read', 'write', 'orders'].map(perm => (
                                        <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={newKeyPermissions.includes(perm)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewKeyPermissions([...newKeyPermissions, perm]);
                                                    } else {
                                                        setNewKeyPermissions(newKeyPermissions.filter(p => p !== perm));
                                                    }
                                                }}
                                            />
                                            <span style={{ textTransform: 'capitalize' }}>{perm}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={generateApiKey}
                                    disabled={generating || !newKeyName.trim()}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: generating || !newKeyName.trim() ? '#94a3b8' : '#4338ca',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: generating || !newKeyName.trim() ? 'not-allowed' : 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    {generating ? 'Generating...' : 'Generate Key'}
                                </button>
                                <button
                                    onClick={() => setShowNewKeyModal(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Active API Keys</h3>
                    {apiKeys.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                            No API keys generated yet. Click &quot;Generate New API Key&quot; to create one.
                        </p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {apiKeys.map(apiKey => (
                                <div key={apiKey.id} style={{ 
                                    padding: '1.5rem', 
                                    background: '#f8fafc', 
                                    borderRadius: '8px', 
                                    border: '1px solid #e2e8f0',
                                    opacity: apiKey.isActive ? 1 : 0.6
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.25rem 0' }}>{apiKey.name}</h4>
                                            <code style={{ fontSize: '0.85rem', color: '#64748b' }}>{apiKey.key}</code>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => toggleApiKeyStatus(apiKey.id, apiKey.isActive)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: apiKey.isActive ? '#f59e0b' : '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {apiKey.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => revokeApiKey(apiKey.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                Revoke
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                                        <span>Permissions: {apiKey.permissions.join(', ')}</span>
                                        <span>•</span>
                                        <span>Usage: {apiKey.usageCount} requests</span>
                                        <span>•</span>
                                        <span>Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleString() : 'Never'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Webhooks Tab */}
            {activeTab === 'webhooks' && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Webhook Configuration</h2>
                    
                    <div style={{ 
                        padding: '1.5rem', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: '2px dashed #cbd5e1'
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>Razorpay Webhook URL</h3>
                        <code style={{ 
                            display: 'block',
                            padding: '1rem',
                            background: '#0f172a',
                            color: '#22c55e',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            wordBreak: 'break-all'
                        }}>
                            {typeof window !== 'undefined' ? `${window.location.origin}/api/payment/callback` : 'https://your-domain.com/api/payment/callback'}
                        </code>
                        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                            Configure this URL in your Razorpay Dashboard under Settings → Webhooks
                        </p>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Supported Events</h3>
                        <ul style={{ lineHeight: '2', color: '#475569' }}>
                            <li>✅ <code>payment.captured</code> - Payment successful</li>
                            <li>✅ <code>payment.failed</code> - Payment failed</li>
                            <li>✅ <code>order.paid</code> - Order fully paid</li>
                            <li>✅ <code>refund.processed</code> - Refund completed</li>
                        </ul>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
                        <strong style={{ color: '#92400e' }}>⚠️ Important:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#92400e', fontSize: '0.9rem' }}>
                            Make sure to add the webhook secret above in the API & Keys tab for secure signature verification.
                        </p>
                    </div>
                </div>
            )}

            {/* Database Tab */}
            {activeTab === 'database' && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Database Tools</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>📊 Database Stats</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>View table counts and sizes</p>
                            <button
                                onClick={() => window.open('/api/admin/developer/db-stats', '_blank')}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    background: '#4338ca',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                View Stats
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>🔄 Re-seed Data</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Reset and re-seed sample data</p>
                            <button
                                onClick={() => {
                                    if (confirm('This will reset all data. Are you sure?')) {
                                        window.open('/api/admin/developer/reseed', '_blank');
                                    }
                                }}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Re-seed Database
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>🧹 Cleanup</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Remove old/invalid data</p>
                            <button
                                onClick={() => {
                                    if (confirm('This will remove old data. Continue?')) {
                                        fetch('/api/admin/developer/cleanup', { method: 'POST' }).then(() => setMessage('✅ Cleanup completed'));
                                    }
                                }}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    background: '#f59e0b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Run Cleanup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* System Info Tab */}
            {activeTab === 'system' && systemInfo && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>System Information</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                            <h3 style={{ marginBottom: '1rem', color: '#4338ca' }}>🖥️ Environment</h3>
                            <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                <tbody>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Node Version</td><td style={{ fontWeight: 600 }}>{systemInfo.nodeVersion}</td></tr>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Next.js Version</td><td style={{ fontWeight: 600 }}>{systemInfo.nextVersion}</td></tr>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Environment</td><td style={{ fontWeight: 600 }}>{systemInfo.environment}</td></tr>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Platform</td><td style={{ fontWeight: 600 }}>{systemInfo.platform}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                            <h3 style={{ marginBottom: '1rem', color: '#4338ca' }}>💾 Database</h3>
                            <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                <tbody>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Provider</td><td style={{ fontWeight: 600 }}>{systemInfo.dbProvider}</td></tr>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Connection</td><td style={{ fontWeight: 600 }}>{systemInfo.dbConnected ? '✅ Connected' : '❌ Disconnected'}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                            <h3 style={{ marginBottom: '1rem', color: '#4338ca' }}>📊 Application Stats</h3>
                            <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                <tbody>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Total Orders</td><td style={{ fontWeight: 600 }}>{systemInfo.orderCount}</td></tr>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Total Users</td><td style={{ fontWeight: 600 }}>{systemInfo.userCount}</td></tr>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Total Menu Items</td><td style={{ fontWeight: 600 }}>{systemInfo.menuItemCount}</td></tr>
                                    <tr><td style={{ padding: '0.5rem 0', color: '#64748b' }}>Server Time</td><td style={{ fontWeight: 600 }}>{new Date(systemInfo.serverTime).toLocaleString()}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Tools Tab */}
            {activeTab === 'tools' && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Maintenance Tools</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>🗑️ Clear Cache</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Clear Next.js cache and revalidate pages</p>
                            <button
                                onClick={handleClearCache}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    background: '#4338ca',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Clear Cache
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>🔄 Revalidate Pages</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Force revalidation of all static pages</p>
                            <button
                                onClick={handleRevalidate}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    background: '#4338ca',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Revalidate All
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>📋 API Logs</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>View recent API request logs</p>
                            <button
                                onClick={() => window.open('/api/admin/developer/logs', '_blank')}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                View Logs
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
