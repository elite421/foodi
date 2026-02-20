'use client';

export default function RestaurantsSection({ restaurants }) {
    return (
        <section id="restaurants">
            <div className="section-header">
                <h2>Popular <span>Restaurants</span></h2>
            </div>
            <div className="restaurants-grid">
                {(restaurants || []).map(r => (
                    <div key={r.id} className="restaurant-card">
                        <div className="restaurant-card-img">
                            <img src={r.image} alt={r.name} loading="lazy" />
                            {r.offer && <div className="restaurant-card-offer">🔥 {r.offer}</div>}
                        </div>
                        <div className="restaurant-card-info">
                            <h3>{r.name}</h3>
                            <div className="cuisine">{r.cuisine}</div>
                            <div className="restaurant-card-meta">
                                <span className="restaurant-rating">⭐ {r.rating}</span>
                                <span className="restaurant-time">🕐 {r.deliveryTime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
