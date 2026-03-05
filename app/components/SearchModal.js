'use client';
import { useState, useEffect, useRef } from 'react';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';

export default function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch('/api/menu/search?q=' + encodeURIComponent(query));
                const data = await res.json();
                setResults(data.items || []);
            } catch (err) {
                setResults([]);
            }
            setLoading(false);
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: '10vh'
        }} onClick={onClose}>
            <div style={{
                background: 'white', width: '90%', maxWidth: 600, borderRadius: 24,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', maxHeight: '80vh'
            }} onClick={e => e.stopPropagation()}>

                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', color: '#64748b' }}>🔍</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for dishes, categories..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1, border: 'none', outline: 'none', fontSize: '1.2rem',
                            fontFamily: 'inherit', color: '#0f172a', background: 'transparent'
                        }}
                    />
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', fontSize: '1.5rem',
                        color: '#94a3b8', cursor: 'pointer', padding: '0 0.5rem'
                    }}>✕</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0', background: '#f8fafc' }}>
                    {loading && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Searching...</div>
                    )}

                    {!loading && query.length > 1 && results.length === 0 && (
                        <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#64748b' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                            <h3>No dishes found</h3>
                            <p>We couldn't find anything matching "{query}"</p>
                        </div>
                    )}

                    {!loading && results.map(item => (
                        <div key={item.id} style={{
                            padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0',
                            display: 'flex', gap: '1rem', alignItems: 'center',
                            background: 'white', transition: 'background 0.2s'
                        }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                            <img src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 4 }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</span>
                                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, background: item.isVeg ? '#dcfce7' : '#fee2e2', color: item.isVeg ? '#166534' : '#991b1b', fontWeight: 700 }}>
                                        {item.isVeg ? 'VEG' : 'N-VEG'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.description}
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4338ca', marginTop: 4 }}>
                                    ₹{item.price}
                                </div>
                            </div>
                            <div>
                                {item.isAvailable ? (
                                    <button onClick={() => { addToCart(item); onClose(); }} style={{
                                        background: '#f59e0b', color: 'white', padding: '8px 16px', borderRadius: 20,
                                        fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
                                    }}>
                                        Add to Cart
                                    </button>
                                ) : (
                                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>Out of Stock</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
