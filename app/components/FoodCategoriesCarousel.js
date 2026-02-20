'use client';

export default function FoodCategoriesCarousel({ categories }) {
    return (
        <section className="food-categories-section" id="food-categories">
            <h2>Explore by <strong>Cuisine</strong></h2>
            <div className="food-category-cards">
                {(categories || []).slice(0, 8).map(cat => (
                    <div key={cat.id} className="food-category-card">
                        <img src={cat.image} alt={cat.name} loading="lazy" />
                        <div className="label">{cat.name}</div>
                    </div>
                ))}
            </div>
            <div className="carousel-dots" style={{ justifyContent: 'center' }}>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`carousel-dot ${i === 0 ? 'active' : ''}`} />
                ))}
            </div>
        </section>
    );
}
