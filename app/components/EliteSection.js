'use client';

export default function EliteSection({ elite }) {
    if (!elite) return null;
    return (
        <>
            <section className="elite-section" id="elite">
                <div className="elite-content">
                    <div className="elite-title">👑 {elite.title || 'ELITE'}</div>
                    <div className="elite-benefits">
                        <div className="elite-benefit">
                            <div className="benefit-icon">🚚</div>
                            <div className="benefit-label">FREE Delivery</div>
                            <div className="benefit-value">{elite.freeDelivery}</div>
                        </div>
                        <div className="elite-benefit">
                            <div className="benefit-icon">🍽️</div>
                            <div className="benefit-label">FREE Dishes</div>
                            <div className="benefit-value">{elite.freeDishes}</div>
                        </div>
                    </div>
                    <div className="elite-cta">
                        <span>{elite.tagline}</span>
                        <button className="btn-login">Login</button>
                    </div>
                </div>
            </section>
            {elite.items?.length > 0 && (
                <div className="elite-dishes">
                    <div className="elite-dishes-header">
                        <h3>🎁 FREE Dish for the <strong>ELITE</strong></h3>
                        <button className="btn-explore" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>See All ►</button>
                    </div>
                    <div className="elite-dishes-grid">
                        {elite.items.map(item => (
                            <div key={item.id} className="elite-dish">
                                <img src={item.image} alt={item.label} loading="lazy" />
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
