'use client';
import Link from 'next/link';

export default function HeroSection({ hero, restaurants }) {
    const featuredBrands = (restaurants || []).filter(r => r.featured).slice(0, 5);
    
    // Get the title lines - default to "Tasty Bite" if not set
    const titleLine1 = hero?.title_line1 || 'Tasty';
    const titleLine2 = hero?.title_line2 || 'Bite';
    const badgeText = hero?.badge_text || 'New';
    const subtitle = hero?.subtitle || 'Fresh food, bold flavors';
    const cartButtonText = hero?.cart_button_text || '🛒 View Cart';
    
    return (
        <section id="hero">
            <div className="hero">
                <div className="hero-left">
                    {/* Badge */}
                    <div style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        {badgeText}
                    </div>
                    
                    {/* Title with two lines */}
                    <h1 style={{ margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
                        <span style={{ display: 'block' }}>{titleLine1}</span>
                        <span style={{ display: 'block', color: '#4338ca' }}>{titleLine2}</span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p style={{ 
                        fontSize: '1.25rem', 
                        color: '#64748b', 
                        marginBottom: '1.5rem',
                        fontWeight: 500 
                    }}>
                        {subtitle}
                    </p>
                    
                    {/* Search and Actions */}
                    <div className="hero-search" id="hero-search" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder={hero?.searchPlaceholder || 'Enter your delivery location'}
                            style={{ flex: 1, minWidth: 250 }}
                        />
                        <button className="btn-locate">
                            <span>◎</span> Locate Me
                        </button>
                        <button className="btn-order">Order Now</button>
                        
                        {/* Cart Button */}
                        <Link href="/cart" style={{
                            padding: '12px 24px',
                            background: 'white',
                            color: '#4338ca',
                            border: '2px solid #4338ca',
                            borderRadius: 12,
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }} onMouseEnter={e => {
                            e.currentTarget.style.background = '#4338ca';
                            e.currentTarget.style.color = 'white';
                        }} onMouseLeave={e => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#4338ca';
                        }}>
                            {cartButtonText}
                        </Link>
                    </div>
                </div>
                <div className="hero-right">
                    <div className="hero-offer">
                        <div className="hero-offer-badge">{hero?.bannerOffer?.title || 'BUY 1 GET 1'}</div>
                        <div className="hero-offer-free">{hero?.bannerOffer?.highlight || 'FREE'}</div>
                        <div className="hero-offer-subtitle">{hero?.bannerOffer?.subtitle || 'ALL DAY, EVERYDAY'}</div>
                    </div>
                    <div className="hero-brands">
                        {featuredBrands.map((r) => (
                            <div key={r.id} className="hero-brand-card">
                                <img src={r.image} alt={r.name} loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {hero?.stats && (
                <div className="hero-stats">
                    <span>⭐ {hero.stats.rating}</span>
                    <span>•</span>
                    <span>📥 {hero.stats.downloads}</span>
                    <span>•</span>
                    <span>🏙️ {hero.stats.cities}</span>
                </div>
            )}
        </section>
    );
}
