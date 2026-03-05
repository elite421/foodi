'use client';
import { useState } from 'react';

export default function FAQSection() {
    const faqs = [
        {
            question: "What is Fooodie Club?",
            answer: "Fooodie Club is a multi-brand cloud kitchen platform operated by Foodfactory Marketplace Pvt Ltd, offering a variety of cuisines under one roof. Customers can order from multiple brands in a single order through our website."
        },
        {
            question: "Where is Fooodie Club available?",
            answer: "Currently, Fooodie Club operates in selected locations in Pune. Delivery availability depends on your pincode."
        },
        {
            question: "How can I place an order?",
            answer: "You can place an order directly through:\n• Our official website: fooodieclub.com\n• Partner delivery platforms like Zomato and Swiggy (if listed)\n\nSimply select your items, add to cart, enter your delivery details, and proceed to payment."
        },
        {
            question: "Can I order from multiple brands in one order?",
            answer: "Yes! Fooodie Club allows you to order from multiple in-house brands in a single checkout for your convenience."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept:\n• UPI\n• Debit/Credit Cards\n• Net Banking\n• Wallets\n• Cash on Delivery (if available in your area)"
        },
        {
            question: "Is there a minimum order value?",
            answer: "Minimum order value may vary based on location and ongoing offers. The amount will be displayed at checkout."
        },
        {
            question: "Can I cancel my order?",
            answer: "Orders can be cancelled within 1 minute of placing the order. After that, cancellation may not be possible as preparation starts immediately."
        },
        {
            question: "How long does delivery take?",
            answer: "Delivery usually takes 30–45 minutes, depending on:\n• Location\n• Order size\n• Traffic conditions"
        },
        {
            question: "Are your kitchens hygienic?",
            answer: "Yes. We follow strict hygiene, food safety, and quality control standards. All food is prepared in sanitized kitchens using fresh ingredients."
        },
        {
            question: "Do you charge GST?",
            answer: "Yes. As per government regulations, 5% GST is applicable on food orders and is included in the final billing."
        },
        {
            question: "Is packaging charge included?",
            answer: "Packaging charges may apply depending on the order and will be clearly shown before payment."
        },
        {
            question: "What if I receive wrong or damaged items?",
            answer: "Please contact us immediately at:\n📧 Wecare@fooodieclub.com\n📞 9270296886\n\nShare your order ID and issue details. Our support team will assist you promptly."
        },
        {
            question: "Do you offer refunds?",
            answer: "Refunds (if applicable) are processed within 5–7 working days to the original payment method after verification."
        },
        {
            question: "Do you offer bulk or corporate orders?",
            answer: "Yes, we accept bulk and corporate orders. Please contact us directly for customized pricing and menu options."
        },
        {
            question: "How can I partner with Fooodie Club?",
            answer: "If you are interested in collaboration or supply partnerships, email us at Wecare@fooodieclub.com."
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <div className="about-section-title">
                    <h2>Frequently Asked <span>Questions</span></h2>
                    <div className="underbar"></div>
                </div>
                <div className="faq-grid">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-card ${openIndex === index ? 'faq-card--open' : ''}`}
                        >
                            <button
                                className="faq-card-question"
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span className="faq-card-number">{String(index + 1).padStart(2, '0')}</span>
                                <span className="faq-card-text">{faq.question}</span>
                                <span className="faq-card-toggle">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={openIndex === index ? 'faq-icon-rotated' : ''}
                                    >
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </span>
                            </button>
                            <div className={`faq-card-answer ${openIndex === index ? 'faq-card-answer--visible' : ''}`}>
                                <div className="faq-card-answer-inner">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
