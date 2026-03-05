'use client';
import Link from 'next/link';

export default function FoodCategoriesCarousel({ categories }) {
    return (
        <section className="food-categories-section" id="food-categories">
            <h2>Explore by <strong>Cuisine</strong></h2>
            <div className="food-category-cards">
                {(categories || []).slice(0, 8).map(cat => (
                    <Link key={cat.id} href={`/menu?category=${cat.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="food-category-card">
                            <img src={cat.image} alt={cat.name} loading="lazy" />
                            <div className="label">{cat.name}</div>
                        </div>
                    </Link>
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
