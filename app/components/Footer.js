'use client';
import Link from 'next/link';

export default function Footer({ settings }) {
    const s = settings || {};
    return (
        <footer className="footer" id="footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <div className="footer-logo">{s.siteName || 'FooodieClub'}</div>
                    <p>Order from multiple restaurants in one single order. Fast delivery, amazing offers, and trusted restaurants near you.</p>
                </div>
                <div className="footer-links">
                    <h4>Company</h4>
                    <ul>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href={`tel:${s.phone || ''}`}>{s.phone || '1800-123-4567'}</a></li>
                        <li><a href={`mailto:${s.email || ''}`}>{s.email || 'support@fooodieclub.com'}</a></li>
                        <li><span>{s.address || ''}</span></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} {s.siteName || 'FooodieClub'}. All rights reserved.</p>
                <div className="footer-social">
                    <a href={s.socialLinks?.facebook || '#'} aria-label="Facebook">f</a>
                    <a href={s.socialLinks?.instagram || '#'} aria-label="Instagram">📷</a>
                    <a href={s.socialLinks?.twitter || '#'} aria-label="Twitter">𝕏</a>
                </div>
            </div>
        </footer>
    );
}
