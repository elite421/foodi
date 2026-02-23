'use client';
import { useState, useEffect, useRef } from 'react';

export default function OfferCarousel({ offers }) {
    const [active, setActive] = useState(0);
    const scrollRef = useRef(null);
    const activeOffers = (offers || []).filter(o => o.active);

    useEffect(() => {
        if (activeOffers.length <= 1) return;
        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % activeOffers.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [activeOffers.length]);

    useEffect(() => {
        if (scrollRef.current) {
            const card = scrollRef.current.children[active];
            if (card) {
                scrollRef.current.scrollTo({
                    left: card.offsetLeft - scrollRef.current.offsetLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [active]);

    if (!activeOffers.length) return null;

    return (
        <section className="offer-carousel" id="offers">
            <div className="offer-cards" ref={scrollRef}>
                {activeOffers.map((offer, i) => (
                    <div key={offer.id} className="offer-card">
                        <img src={offer.image} alt={offer.title} loading="lazy" />
                        <div className="offer-card-overlay">
                            <span className="offer-tag">{offer.title} {offer.subtitle}</span>
                            <span className="offer-from">from {offer.restaurant}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="carousel-dots">
                {activeOffers.map((_, i) => (
                    <button key={i} className={`carousel-dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
                ))}
            </div>
        </section>
    );
}
