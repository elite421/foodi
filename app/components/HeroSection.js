'use client';

export default function HeroSection({ hero, restaurants }) {
    const featuredBrands = (restaurants || []).filter(r => r.featured).slice(0, 5);
    return (
        <section id="hero">
            <div className="hero">
                <div className="hero-left">
                    <h1>{hero?.title || 'Welcome to FooodieClub!'}</h1>
                    <p>
                        {hero?.subtitle || 'Order from Multiple restaurants in one single order.'}{' '}
                        {hero?.promoText || ''}
                    </p>
                    <div className="hero-search" id="hero-search">
                        <input
                            type="text"
                            placeholder={hero?.searchPlaceholder || 'Enter your delivery location'}
                        />
                        <button className="btn-locate">
                            <span>◎</span> Locate Me
                        </button>
                        <button className="btn-order">Order Now</button>
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
