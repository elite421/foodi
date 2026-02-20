'use client';
import Link from 'next/link';

export default function CategoriesSection({ categories }) {
    return (
        <section id="categories">
            <div className="section-header">
                <h2>Explore Our <span>Menu Categories</span></h2>
                <Link href="/menu"><button className="btn-explore">View Full Menu &rsaquo;</button></Link>
            </div>
            <div className="categories-scroll">
                {(categories || []).map(cat => (
                    <div key={cat.id} className="category-item">
                        <div className="category-icon">
                            <img src={cat.image} alt={cat.name} loading="lazy" />
                        </div>
                        <span>{cat.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
