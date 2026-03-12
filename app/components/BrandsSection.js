'use client';
import Link from 'next/link';

export default function BrandsSection({ brands = [] }) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="brands-section" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-header" style={{ padding: '0 0 1rem' }}>
                <h2>Our Partner <span>Brands</span></h2>
            </div>
            <div className="brands-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                justifyItems: 'center'
            }}>
                {brands.map(brand => (
                    <Link key={brand.id} href={`/brand/${brand.slug}`} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                        <div className="brand-card" style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            cursor: 'pointer',
                            width: '100%',
                            aspectRatio: '1',
                            border: '1px solid #f1f5f9'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.05)';
                            }}>
                            <img
                                src={brand.image}
                                alt={brand.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                                loading="lazy"
                            />
                            <div style={{ marginTop: '1rem', fontWeight: 600, fontSize: '1.1rem', textAlign: 'center' }}>
                                {brand.name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
