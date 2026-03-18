'use client';
import { useState, useEffect } from 'react';

export default function AdminHero() {
    const [hero, setHero] = useState(null);
    const [toast, setToast] = useState('');
    
    useEffect(() => { 
        fetch('/api/admin/hero').then(r => r.json()).then(setHero); 
    }, []);
    
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const save = async () => {
        await fetch('/api/admin/hero', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hero)
        });
        showToast('Hero section saved!');
    };

    if (!hero) return <p>Loading...</p>;
    
    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>🏠 Hero Section</h1>
                <button className="btn-admin btn-admin-primary" onClick={save}>Save Changes</button>
            </div>
            
            <div className="admin-card">
                <h3>Main Hero Content</h3>
                <div className="admin-form">
                    <div className="form-row">
                        <div className="form-group"><label>Badge Text</label><input value={hero.badge_text || ''} onChange={e => setHero({ ...hero, badge_text: e.target.value })} placeholder="e.g., New, Hot, Popular" /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Title Line 1</label><input value={hero.title_line1 || ''} onChange={e => setHero({ ...hero, title_line1: e.target.value })} placeholder="First line of title" /></div>
                        <div className="form-group"><label>Title Line 2</label><input value={hero.title_line2 || ''} onChange={e => setHero({ ...hero, title_line2: e.target.value })} placeholder="Second line of title" /></div>
                    </div>
                    <div className="form-group"><label>Subtitle</label><input value={hero.subtitle || ''} onChange={e => setHero({ ...hero, subtitle: e.target.value })} placeholder="Fresh food, bold flavors" /></div>
                    <div className="form-group"><label>Search Placeholder</label><input value={hero.search_placeholder || ''} onChange={e => setHero({ ...hero, search_placeholder: e.target.value })} /></div>
                    <div className="form-row">
                        <div className="form-group"><label>Cart Button Text</label><input value={hero.cart_button_text || ''} onChange={e => setHero({ ...hero, cart_button_text: e.target.value })} placeholder="e.g., View Cart, My Cart" /></div>
                    </div>
                </div>
            </div>
            
            <div className="admin-card">
                <h3>Stats Section</h3>
                <div className="admin-form">
                    <div className="form-row">
                        <div className="form-group"><label>Rating Text</label><input value={hero.stats_rating || ''} onChange={e => setHero({ ...hero, stats_rating: e.target.value })} /></div>
                        <div className="form-group"><label>Downloads Text</label><input value={hero.stats_downloads || ''} onChange={e => setHero({ ...hero, stats_downloads: e.target.value })} /></div>
                        <div className="form-group"><label>Cities Text</label><input value={hero.stats_cities || ''} onChange={e => setHero({ ...hero, stats_cities: e.target.value })} /></div>
                    </div>
                </div>
            </div>
            
            <div className="admin-card">
                <h3>Banner Section</h3>
                <div className="admin-form">
                    <div className="form-row">
                        <div className="form-group"><label>Banner Title</label><input value={hero.banner_title || ''} onChange={e => setHero({ ...hero, banner_title: e.target.value })} /></div>
                        <div className="form-group"><label>Banner Highlight</label><input value={hero.banner_highlight || ''} onChange={e => setHero({ ...hero, banner_highlight: e.target.value })} /></div>
                        <div className="form-group"><label>Banner Subtitle</label><input value={hero.banner_subtitle || ''} onChange={e => setHero({ ...hero, banner_subtitle: e.target.value })} /></div>
                    </div>
                </div>
            </div>
            
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
