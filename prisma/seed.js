import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const hash = bcrypt.hashSync('admin123', 10);
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: { username: 'admin', password: hash, name: 'FooodieClub Admin' }
    });

    await prisma.hero.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1, title: 'Welcome to FooodieClub!',
            subtitle: 'Order from our exclusive menu.',
            promoText: 'Use code: FC50 to get FLAT 50% OFF on your 1st order.',
            searchPlaceholder: 'What are you craving today?',
            statsRating: '5.0 rated', statsDownloads: '10K+ Happy Customers',
            statsCities: 'Fast Delivery in city',
            bannerTitle: 'BUY 1 GET 1', bannerHighlight: 'FREE', bannerSubtitle: 'ALL DAY, EVERYDAY'
        }
    });

    await prisma.settings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1, siteName: 'FooodieClub', tagline: 'Your favorite restaurant, online', domain: 'fooodieclub.com',
            phone: '1800-123-4567', email: 'support@fooodieclub.com',
            address: '123 Food Street, New Delhi, India',
            facebook: 'https://facebook.com/fooodieclub', instagram: 'https://instagram.com/fooodieclub',
            twitter: 'https://twitter.com/fooodieclub',
            primaryColor: '#4338ca', secondaryColor: '#f59e0b',
            restaurantLat: 28.6139, restaurantLng: 77.2090, deliveryRadius: 10.0,
            taxPercentage: 5.0, baseDeliveryFee: 40.0
        }
    });

    await prisma.elite.upsert({
        where: { id: 1 }, update: {},
        create: { id: 1, title: 'ELITE', tagline: 'Claim your Elite benefits', freeDelivery: 'above ₹199', freeDishes: 'above ₹449' }
    });

    // Seed Brands
    const brands = [
        { id: 'brand-1', name: 'Authentic Bowls', slug: 'authentic-bowls', image: '/logos/authentic bowls final.png', description: 'Delicious authentic bowl meals' },
        { id: 'brand-2', name: 'The Lunch Box', slug: 'the-lunch-box', image: '/logos/the lunch box final.png', description: 'Fresh and healthy lunch options' },
        { id: 'brand-3', name: 'The Royal Biryani', slug: 'the-royal-biryani', image: '/logos/the royal biryani final.png', description: 'Authentic royal biryani flavors' },
        { id: 'brand-4', name: 'Wapi', slug: 'wapi', image: '/logos/wapi final.png', description: 'Premium food delivery partner' }
    ];
    for (const b of brands) {
        await prisma.brand.upsert({ where: { id: b.id }, update: {}, create: b });
    }

    const categories = [
        { id: 'cat-1', name: 'Pizzas', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop', sortOrder: 1 },
        { id: 'cat-2', name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', sortOrder: 2 },
        { id: 'cat-3', name: 'Biryani', icon: '🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop', sortOrder: 3 },
        { id: 'cat-4', name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop', sortOrder: 4 },
        { id: 'cat-5', name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', sortOrder: 5 },
    ];
    for (const c of categories) {
        await prisma.category.upsert({ where: { id: c.id }, update: {}, create: c });
    }

    // Create menu items first and store their IDs
    const menuItemsData = [
        // Authentic Bowls items
        { categoryId: 'cat-1', brandId: 'brand-1', name: 'Buddha Bowl', description: 'Nutritious bowl with quinoa, avocado, and fresh veggies.', price: 349, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', isVeg: true, sortOrder: 1 },
        { categoryId: 'cat-1', brandId: 'brand-1', name: 'Poke Bowl', description: 'Fresh Hawaiian poke with salmon and vegetables.', price: 449, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', isVeg: false, sortOrder: 2 },
        { categoryId: 'cat-1', brandId: 'brand-1', name: 'Grain Bowl', description: 'Healthy grain bowl with mixed greens and proteins.', price: 299, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&h=300&fit=crop', isVeg: true, sortOrder: 3 },
        // The Lunch Box items
        { categoryId: 'cat-2', brandId: 'brand-2', name: 'Classic Lunch Box', description: 'Complete meal with rice, curry, and sides.', price: 199, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', isVeg: true, sortOrder: 1 },
        { categoryId: 'cat-2', brandId: 'brand-2', name: 'Premium Thali', description: 'Deluxe thali with 4 curries, rice, and bread.', price: 299, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', isVeg: false, sortOrder: 2 },
        { categoryId: 'cat-2', brandId: 'brand-2', name: 'Healthy Box', description: 'Low calorie lunch option with salad and protein.', price: 249, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', isVeg: true, sortOrder: 3 },
        // The Royal Biryani items
        { categoryId: 'cat-3', brandId: 'brand-3', name: 'Hyderabadi Chicken Biryani', description: 'Authentic dum biryani with tender chicken.', price: 349, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', isVeg: false, sortOrder: 1 },
        { categoryId: 'cat-3', brandId: 'brand-3', name: 'Veg Biryani', description: 'Fragrant rice with mixed vegetables and spices.', price: 249, image: 'https://images.unsplash.com/photo-1642821373181-6962d825b9cd?w=400&h=300&fit=crop', isVeg: true, sortOrder: 2 },
        { categoryId: 'cat-3', brandId: 'brand-3', name: 'Mutton Biryani', description: 'Royal mutton biryani with premium spices.', price: 449, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', isVeg: false, sortOrder: 3 },
        // Wapi items
        { categoryId: 'cat-4', brandId: 'brand-4', name: 'Chocolate Lava Cake', description: 'Warm cake with a gooey chocolate center.', price: 129, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop', isVeg: true, sortOrder: 1 },
        { categoryId: 'cat-4', brandId: 'brand-4', name: 'Gulab Jamun', description: 'Sweet milk solids in sugar syrup.', price: 99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', isVeg: true, sortOrder: 2 },
        { categoryId: 'cat-5', brandId: 'brand-4', name: 'Coca Cola', description: 'Refreshing cold drink.', price: 49, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop', isVeg: true, sortOrder: 3 },
        { categoryId: 'cat-5', brandId: 'brand-4', name: 'Fresh Lime Soda', description: 'Refreshing lime soda.', price: 79, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop', isVeg: true, sortOrder: 4 },
    ];

    const menuItemIds = [];
    for (const m of menuItemsData) {
        const id = 'menu-' + Math.random().toString(36).substr(2, 9);
        await prisma.menuItem.upsert({
            where: { id },
            update: {},
            create: { id, ...m }
        });
        menuItemIds.push({ id, ...m });
    }

    const offers = [
        { id: 'offer-1', title: 'BUY 1 GET 1 FREE', subtitle: 'ON ALL PIZZAS', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=300&fit=crop', bgColor: '#4338ca', active: true },
        { id: 'offer-2', title: 'FLAT 50% OFF', subtitle: 'ON DESSERTS', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=300&fit=crop', bgColor: '#7c3aed', active: true },
        { id: 'offer-3', title: 'FREE DELIVERY', subtitle: 'ON ORDERS ABOVE ₹199', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=300&fit=crop', bgColor: '#10b981', active: true }
    ];
    for (const o of offers) {
        await prisma.offer.upsert({ where: { id: o.id }, update: {}, create: o });
    }

    const collections = [
        { id: 'col-1', title: 'Weekend Specials at ₹99', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', link: '/menu', description: 'Amazing weekend deals', menuItemIds: JSON.stringify(['menu-' + Math.random().toString(36).substr(2, 9)]) },
        { id: 'col-2', title: 'Bestseller Combos', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', link: '/menu', description: 'Our most popular combos', menuItemIds: JSON.stringify([]) },
        { id: 'col-3', title: 'Healthy Choices', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', link: '/menu', description: 'Nutritious and delicious', menuItemIds: JSON.stringify([]) }
    ];
    for (const c of collections) {
        await prisma.collection.upsert({ where: { id: c.id }, update: {}, create: c });
    }

    const eliteItems = [
        { id: 'elite-1', label: 'Free Delivery Above ₹199', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', sortOrder: 1 },
        { id: 'elite-2', label: 'Free Dish Above ₹449', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop', sortOrder: 2 },
        { id: 'elite-3', label: 'Priority Delivery', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop', sortOrder: 3 }
    ];
    for (const i of eliteItems) {
        await prisma.eliteItem.upsert({ where: { id: i.id }, update: {}, create: i });
    }

    // Seed Coupons
    const coupons = [
        { code: 'FC50', discountType: 'PERCENTAGE', discountValue: 50, maxDiscount: 100, minOrderValue: 200, isActive: true },
        { code: 'WELCOME20', discountType: 'PERCENTAGE', discountValue: 20, maxDiscount: 50, minOrderValue: 150, isActive: true },
        { code: 'FLAT100', discountType: 'FLAT', discountValue: 100, maxDiscount: null, minOrderValue: 300, isActive: true },
        { code: 'PARTYTIME', discountType: 'PERCENTAGE', discountValue: 30, maxDiscount: 200, minOrderValue: 500, isActive: true }
    ];
    for (const c of coupons) {
        await prisma.coupon.upsert({ where: { code: c.code }, update: {}, create: { id: 'coupon-' + Math.random().toString(36).substr(2, 9), ...c } });
    }

    // Seed CMS Pages
    const pages = [
        { id: 'page-1', title: 'About Us', slug: 'about', content: '<h2>About FooodieClub</h2><p>We are a leading food delivery platform connecting you with the best restaurants in your city.</p><p>Our mission is to deliver delicious food to your doorstep with lightning-fast speed.</p>', metaDescription: 'Learn about FooodieClub - your favorite food delivery partner', published: true },
        { id: 'page-2', title: 'Contact Us', slug: 'contact', content: '<h2>Get in Touch</h2><p>Email: support@fooodieclub.com</p><p>Phone: 1800-123-4567</p><p>Address: 123 Food Street, New Delhi, India</p>', metaDescription: 'Contact FooodieClub for support and inquiries', published: true },
        { id: 'page-3', title: 'Privacy Policy', slug: 'privacy', content: '<h2>Privacy Policy</h2><p>We respect your privacy and protect your personal information.</p><p>Your data is safe with us and never shared with third parties.</p>', metaDescription: 'FooodieClub privacy policy and data protection', published: true },
        { id: 'page-4', title: 'Terms of Service', slug: 'terms', content: '<h2>Terms of Service</h2><p>By using our services, you agree to these terms.</p><p>We provide food delivery services subject to availability.</p>', metaDescription: 'FooodieClub terms and conditions', published: true }
    ];
    for (const p of pages) {
        await prisma.page.upsert({ where: { id: p.id }, update: {}, create: p });
    }

    // Seed Parties with Menu Items
    const allMenuItems = await prisma.menuItem.findMany();
    
    const parties = [
        {
            id: 'party-1',
            name: 'Weekend Pizza Party',
            description: 'Enjoy unlimited pizzas with your friends this weekend!',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop',
            date: new Date('2026-03-20T18:00:00'),
            venue: 'Rooftop Garden, Sector 12',
            maxGuests: 50,
            isActive: true,
            items: [
                { menuItemId: allMenuItems.find(m => m.name === 'Buddha Bowl')?.id, quantity: 10, price: 349 },
                { menuItemId: allMenuItems.find(m => m.name === 'Poke Bowl')?.id, quantity: 8, price: 449 },
                { menuItemId: allMenuItems.find(m => m.name === 'Grain Bowl')?.id, quantity: 5, price: 299 },
                { menuItemId: allMenuItems.find(m => m.name === 'Coca Cola')?.id, quantity: 20, price: 49 }
            ]
        },
        {
            id: 'party-2',
            name: 'Biryani Feast Night',
            description: 'Authentic Hyderabadi biryani celebration with live music!',
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=400&fit=crop',
            date: new Date('2026-03-25T19:00:00'),
            venue: 'Community Hall, Block C',
            maxGuests: 100,
            isActive: true,
            items: [
                { menuItemId: allMenuItems.find(m => m.name === 'Hyderabadi Chicken Biryani')?.id, quantity: 25, price: 349 },
                { menuItemId: allMenuItems.find(m => m.name === 'Veg Biryani')?.id, quantity: 15, price: 249 },
                { menuItemId: allMenuItems.find(m => m.name === 'Gulab Jamun')?.id, quantity: 30, price: 99 },
                { menuItemId: allMenuItems.find(m => m.name === 'Fresh Lime Soda')?.id, quantity: 40, price: 79 }
            ]
        },
        {
            id: 'party-3',
            name: 'Birthday Bash Combo',
            description: 'Perfect birthday celebration package with burgers, desserts and drinks!',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
            date: new Date('2026-03-15T17:30:00'),
            venue: 'Party Hall, Downtown',
            maxGuests: 30,
            isActive: true,
            items: [
                { menuItemId: allMenuItems.find(m => m.name === 'Classic Lunch Box')?.id, quantity: 10, price: 199 },
                { menuItemId: allMenuItems.find(m => m.name === 'Premium Thali')?.id, quantity: 10, price: 299 },
                { menuItemId: allMenuItems.find(m => m.name === 'Healthy Box')?.id, quantity: 5, price: 249 },
                { menuItemId: allMenuItems.find(m => m.name === 'Chocolate Lava Cake')?.id, quantity: 15, price: 129 },
                { menuItemId: allMenuItems.find(m => m.name === 'Coca Cola')?.id, quantity: 25, price: 49 }
            ]
        }
    ];

    for (const p of parties) {
        const { items, ...partyData } = p;
        
        // Create party
        await prisma.party.upsert({
            where: { id: p.id },
            update: {},
            create: partyData
        });

        // Create party items
        if (items && items.length > 0) {
            // Delete existing items first
            await prisma.partyItem.deleteMany({ where: { partyId: p.id } });
            
            // Add new items
            for (const item of items) {
                if (item.menuItemId) {
                    await prisma.partyItem.create({
                        data: {
                            id: 'pi-' + Math.random().toString(36).substr(2, 9),
                            partyId: p.id,
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                            price: item.price
                        }
                    });
                }
            }
        }
    }

    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('  - 1 Admin user (admin/admin123)');
    console.log('  - 4 Brands (Authentic Bowls, The Lunch Box, The Royal Biryani, Wapi)');
    console.log('  - 5 Categories');
    console.log('  - 13 Menu items');
    console.log('  - 3 Offers');
    console.log('  - 3 Collections');
    console.log('  - 3 Elite items');
    console.log('  - 4 Coupons');
    console.log('  - 4 CMS Pages');
    console.log('  - 3 Parties with menu items');
}

main()
    .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
