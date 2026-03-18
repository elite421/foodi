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
                    <Link key={cat.id} href={`/menu?category=${cat.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="category-item">
                            <div className="category-icon">
                                <img src={cat.image} alt={cat.name} loading="lazy" />
                            </div>
                            <span>{cat.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
