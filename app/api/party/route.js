import { NextResponse } from 'next/server';

// Google Sheets Web App URL — Replace this with your actual deployed Google Apps Script URL
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_PARTY_URL || '';

// Email recipient
const PARTY_EMAIL = 'Fooodieclub@foodfactorymarketplace.com';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, contact, city, date, guests, email, occasion } = body;

        // Validation
        if (!name || !contact || !city || !date || !guests) {
            return NextResponse.json(
                { error: 'Please fill all required fields (Name, Contact, City, Date, No. of guests)' },
                { status: 400 }
            );
        }

        // 1. Send data to Google Sheets via Apps Script Web App
        let sheetSaved = false;
        if (GOOGLE_SHEETS_URL) {
            try {
                const sheetRes = await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        contact,
                        city,
                        date,
                        guests,
                        email: email || '',
                        occasion: occasion || '',
                        timestamp: new Date().toISOString()
                    })
                });
                if (sheetRes.ok) sheetSaved = true;
            } catch (sheetErr) {
                console.error('Google Sheets error:', sheetErr);
            }
        }

        // 2. Send email notification via Web3Forms (free email API, no server dependencies)
        let emailSent = false;
        try {
            // Using Web3Forms free email service — need to set the access key in .env
            const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY || '';
            if (web3formsKey) {
                const emailRes = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: web3formsKey,
                        to: PARTY_EMAIL,
                        subject: `🎉 New Party Booking Request from ${name}`,
                        from_name: 'FooodieClub Party Bookings',
                        name: name,
                        contact: contact,
                        city: city,
                        date: date,
                        guests: guests,
                        email: email || 'Not provided',
                        occasion: occasion || 'Not specified',
                        message: `
New Party Booking Request:
━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Contact: ${contact}
City: ${city}
Date: ${date}
No. of Guests: ${guests}
Email: ${email || 'Not provided'}
Occasion: ${occasion || 'Not specified'}
━━━━━━━━━━━━━━━━━━━━━━━━
Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        `.trim()
                    })
                });
                if (emailRes.ok) emailSent = true;
            } else {
                // Fallback: Use mailto-style approach via Google Apps Script
                // If no Web3Forms key, we'll rely on the Google Sheets trigger for email
                console.log('No WEB3FORMS_ACCESS_KEY set. Email sending skipped. Set up Google Sheets email trigger instead.');
            }
        } catch (emailErr) {
            console.error('Email sending error:', emailErr);
        }

        return NextResponse.json({
            success: true,
            message: 'Your party booking request has been submitted successfully! We will contact you soon.',
            sheetSaved,
            emailSent
        });

    } catch (error) {
        console.error('Party API error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
