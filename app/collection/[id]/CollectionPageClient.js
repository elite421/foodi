'use client';
import Link from 'next/link';
import { useCart } from '@/app/components/CartContext';

export default function CollectionPageClient({ collection, menuItems, settings }) {
    const { addToCart } = useCart();

    return (
        <div className="collection-page">
            {/* Hero Banner */}
            <div className="collection-hero" style={{
                backgroundImage: collection.image ? `url(${collection.image})` : 'linear-gradient(135deg, #4338ca, #6366f1)'
            }}>
                <div className="collection-hero-overlay">
                    <Link href="/" className="collection-back-btn">← Back</Link>
                    <h1 className="collection-hero-title">{collection.title}</h1>
                    {collection.description && (
                        <p className="collection-hero-desc">{collection.description}</p>
                    )}
                    <div className="collection-hero-count">
                        {menuItems.length} {menuItems.length === 1 ? 'Item' : 'Items'}
                    </div>
                </div>
            </div>

            {/* Items Grid */}
            <div className="collection-items-section">
                <div className="collection-items-grid">
                    {menuItems.map(item => (
                        <div key={item.id} className="collection-item-card">
                            <div className="collection-item-img">
                                <img src={item.image} alt={item.name} loading="lazy" />
                                <span className={`collection-item-badge ${item.isVeg ? 'veg' : 'nonveg'}`}>
                                    {item.isVeg ? '🟩 VEG' : '🟥 NON-VEG'}
                                </span>
                            </div>
                            <div className="collection-item-info">
                                <h3>{item.name}</h3>
                                {item.categoryName && (
                                    <span className="collection-item-cat">{item.categoryName}</span>
                                )}
                                <p>{item.description}</p>
                                <div className="collection-item-footer">
                                    <span className="collection-item-price">₹{item.price}</span>
                                    {item.isAvailable ? (
                                        <button
                                            className="collection-item-add"
                                            onClick={() => addToCart(item)}
                                        >
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <span className="collection-item-oos">Out of Stock</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {menuItems.length === 0 && (
                    <div className="collection-empty">
                        <span>🍽️</span>
                        <h3>No items in this collection yet</h3>
                        <p>Check back later for delicious additions!</p>
                        <Link href="/" className="collection-back-link">← Back to Home</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
