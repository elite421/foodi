'use client';
import Link from 'next/link';

export default function CollectionsSection({ collections }) {
    if (!collections?.length) return null;
    return (
        <section className="collections-section" id="collections">
            <div className="section-header" style={{ padding: '0 0 1rem' }}>
                <h2>Most Loved <strong>Collections</strong></h2>
                <Link href="/menu"><button className="btn-explore">View All &rsaquo;</button></Link>
            </div>
            <div className="collections-grid">
                {collections.map(col => (
                    <Link key={col.id} href={col.link || '/menu'}>
                        <div className="collection-card">
                            <img src={col.image} alt={col.title} loading="lazy" />
                            <div className="collection-card-info">
                                <h3>{col.title}</h3>
                                <div className="collection-arrow">&rsaquo;</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
