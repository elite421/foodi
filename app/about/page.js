import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQSection from '../components/FAQSection';
import { readData } from '../lib/dataManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About Us - FooodieClub', description: 'Learn about FooodieClub, India\'s favourite food delivery platform.' };

export default async function AboutPage() {
    const data = await readData();
    return (
        <>
            <Navbar settings={data.settings} />
            <main className="about-page">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="about-hero-inner">
                        <h1>
                            About <span>Fooodie Club</span>
                        </h1>
                        <p>
                            India's most trusted and scalable multi-brand food platform
                        </p>
                    </div>
                </section>

                {/* Story Section */}
                <section className="about-section">
                    <div className="about-section-title">
                        <h2>Our <span>Story</span></h2>
                        <div className="underbar"></div>
                    </div>

                    <div className="about-story-grid">
                        <div>
                            <div className="about-story-card">
                                <div className="card-head">
                                    <div className="card-icon">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <h3>It Started With a Simple Question</h3>
                                </div>
                                <p>
                                    Why should great food feel inconsistent? Why should customers compromise between taste, hygiene, price, and convenience?
                                </p>
                            </div>

                            <div className="about-story-highlight">
                                <p>
                                    Fooodie Club was born from the belief that food delivery in India could be better — smarter, cleaner, more reliable, and more brand-driven. We didn't want to build just another cloud kitchen. We wanted to build a food ecosystem.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="about-vision-card">
                                <div className="about-vision-inner">
                                    <h4>Our Vision</h4>
                                    <p>
                                        In every Indian home, food is more than a meal. It's comfort after a long day, celebration during special moments, and connection between people.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Standards Section */}
                <section className="about-standards">
                    <div className="about-standards-inner">
                        <div className="about-section-title">
                            <h2>More Than One Brand. <span>One Standard.</span></h2>
                            <div className="underbar"></div>
                        </div>

                        <div className="about-standards-grid">
                            <div className="about-standard-card">
                                <div className="about-standard-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3>Standardized Recipes</h3>
                                <p>Consistent quality across every order</p>
                            </div>

                            <div className="about-standard-card">
                                <div className="about-standard-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <h3>Controlled Costing</h3>
                                <p>Transparent pricing for customers</p>
                            </div>

                            <div className="about-standard-card">
                                <div className="about-standard-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3>Technology-Driven</h3>
                                <p>Efficient operations and delivery</p>
                            </div>
                        </div>

                        <div className="about-standards-banner">
                            <h3>From Royal Biryanis to Wholesome Meal Boxes</h3>
                            <p>Every brand is designed with clarity and scalability in mind.</p>
                        </div>
                    </div>
                </section>

                {/* Promise Section */}
                <section className="about-section">
                    <div className="about-section-title">
                        <h2>The <span>Fooodie Promise</span></h2>
                        <div className="underbar"></div>
                    </div>

                    <div className="about-promise-grid">
                        <div className="about-promise-card">
                            <div className="about-promise-icon green">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4>No Compromise on Hygiene</h4>
                            <p>Strict protocols ensure every meal is safe</p>
                        </div>

                        <div className="about-promise-card">
                            <div className="about-promise-icon blue">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h4>Consistent Taste</h4>
                            <p>Every order tastes exactly as expected</p>
                        </div>

                        <div className="about-promise-card">
                            <div className="about-promise-icon purple">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h4>Transparent Pricing</h4>
                            <p>No hidden costs, clear value</p>
                        </div>

                        <div className="about-promise-card">
                            <div className="about-promise-icon orange">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4>Operational Excellence</h4>
                            <p>No shortcuts, only structured growth</p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="about-mission">
                    <div className="about-mission-inner">
                        <h2>Our Mission</h2>
                        <p>
                            To build India's most trusted and scalable multi-brand food platform — powered by technology, driven by passion, and built for long-term excellence.
                        </p>
                        <div className="about-mission-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* Future Section */}
                <section className="about-section">
                    <div className="about-future-card">
                        <div className="about-section-title">
                            <h2>This Is Just The <span>Beginning</span></h2>
                            <div className="underbar"></div>
                        </div>

                        <div className="about-future-grid">
                            <div>
                                <p>
                                    Fooodie Club is not just about today's orders. It's about building a food company that stands for reliability, innovation, and brand power in the coming decade.
                                </p>
                                <p>
                                    Because great food deserves a great system. And we're here to build it.
                                </p>
                            </div>
                            <div>
                                <div className="about-future-circle">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <FAQSection />

                {/* Journey Section */}
                <section className="about-journey-bg">
                    <div className="about-journey-inner">
                        <div className="about-section-title">
                            <h2>Our <span>Journey</span></h2>
                            <div className="underbar"></div>
                        </div>

                        <div className="about-journey-grid">
                            <div className="about-journey-card">
                                <div className="about-journey-card-inner bg-1">
                                    <div>
                                        <div className="about-journey-icon">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3>State-of-the-Art Kitchens</h3>
                                        <p>Modern facilities maintaining highest hygiene standards</p>
                                    </div>
                                </div>
                            </div>

                            <div className="about-journey-card">
                                <div className="about-journey-card-inner bg-2">
                                    <div>
                                        <div className="about-journey-icon">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3>Expert Team</h3>
                                        <p>Passionate professionals dedicated to quality</p>
                                    </div>
                                </div>
                            </div>

                            <div className="about-journey-card">
                                <div className="about-journey-card-inner bg-3">
                                    <div>
                                        <div className="about-journey-icon">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </div>
                                        <h3>Quality Excellence</h3>
                                        <p>Every dish crafted with perfection</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer settings={data.settings} />
        </>
    );
}
