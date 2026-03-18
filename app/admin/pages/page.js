'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const empty = { title: '', slug: '', content: '', meta_description: '', published: true };

export default function AdminPages() {
    const [pages, setPages] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [toast, setToast] = useState('');

    const load = async () => {
        const res = await fetch('/api/admin/pages');
        if (res.ok) setPages(await res.json());
    };

    useEffect(() => { load(); }, []);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const save = async () => {
        const method = modal === 'add' ? 'POST' : 'PUT';
        const res = await fetch('/api/admin/pages', {
            method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
        });
        if (res.ok) { load(); setModal(null); showToast(modal === 'add' ? 'Page created!' : 'Page updated!'); }
        else { const d = await res.json(); showToast(d.error || 'Error'); }
    };

    const del = async (id) => {
        if (!confirm('Delete this page?')) return;
        await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
        load(); showToast('Page deleted');
    };

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>📄 Pages (CMS)</h1>
                <button className="btn-admin btn-admin-primary" onClick={() => { setForm(empty); setModal('add'); }}>+ Add Page</button>
            </div>
            
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map(p => (
                            <tr key={p.id}>
                                <td><strong>{p.title}</strong></td>
                                <td><code>/{p.slug}</code></td>
                                <td>
                                    <span style={{ 
                                        background: p.published ? '#dcfce7' : '#fee2e2', 
                                        color: p.published ? '#166534' : '#991b1b',
                                        padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem'
                                    }}>
                                        {p.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {new Date(p.updated_at || p.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="admin-actions">
                                    <Link href={`/${p.slug}`} target="_blank" className="btn-admin btn-admin-outline" style={{ marginRight: 8 }}>View</Link>
                                    <button className="btn-admin btn-admin-outline" onClick={() => { setForm(p); setModal('edit'); }}>Edit</button>
                                    <button className="btn-admin btn-admin-danger" style={{ marginLeft: 8 }} onClick={() => del(p.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
                        <h2>{modal === 'add' ? 'Create Page' : 'Edit Page'}</h2>
                        <div className="admin-form">
                            <div className="form-group">
                                <label>Page Title</label>
                                <input 
                                    required 
                                    value={form.title} 
                                    onChange={e => {
                                        const title = e.target.value;
                                        setForm({ 
                                            ...form, 
                                            title,
                                            slug: modal === 'add' && !form.slug ? generateSlug(title) : form.slug
                                        });
                                    }} 
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Slug (URL)</label>
                                    <input 
                                        required 
                                        value={form.slug} 
                                        onChange={e => setForm({ ...form, slug: e.target.value })} 
                                        placeholder="about-us"
                                    />
                                </div>
                                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <input 
                                        type="checkbox" 
                                        id="page_published" 
                                        checked={form.published} 
                                        onChange={e => setForm({ ...form, published: e.target.checked })} 
                                    />
                                    <label htmlFor="page_published" style={{ marginBottom: 0 }}>Published</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Meta Description (SEO)</label>
                                <input 
                                    value={form.meta_description || form.metaDescription || ''} 
                                    onChange={e => setForm({ ...form, meta_description: e.target.value })} 
                                    placeholder="Brief description for search engines"
                                />
                            </div>
                            <div className="form-group">
                                <label>Page Content (HTML)</label>
                                <textarea 
                                    value={form.content} 
                                    onChange={e => setForm({ ...form, content: e.target.value })} 
                                    style={{ minHeight: 200, fontFamily: 'monospace', fontSize: '0.9rem' }}
                                    placeholder="<h2>Welcome</h2><p>Your content here...</p>"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-admin btn-admin-outline" onClick={() => setModal(null)}>Cancel</button>
                            <button className="btn-admin btn-admin-primary" onClick={save}>Save Page</button>
                        </div>
                    </div>
                </div>
            )}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
