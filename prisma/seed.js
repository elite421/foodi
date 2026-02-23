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

    const categories = [
        { id: 'cat-1', name: 'Pizzas', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop', sortOrder: 1 },
        { id: 'cat-2', name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', sortOrder: 2 },
        { id: 'cat-3', name: 'Biryani', icon: '🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop', sortOrder: 3 },
        { id: 'cat-4', name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop', sortOrder: 4 },
    ];
    for (const c of categories) {
        await prisma.category.upsert({ where: { id: c.id }, update: {}, create: c });
    }

    const menuItems = [
        { categoryId: 'cat-1', name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese.', price: 299, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', isVeg: true, sortOrder: 1 },
        { categoryId: 'cat-1', name: 'Pepperoni Pizza', description: 'Double pepper barbecue chicken.', price: 499, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', isVeg: false, sortOrder: 2 },
        { categoryId: 'cat-2', name: 'Veggie Burger', description: 'Crispy potato patty with fresh veggies.', price: 149, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', isVeg: true, sortOrder: 1 },
        { categoryId: 'cat-2', name: 'Chicken Zinger', description: 'Signature chicken burger for the cravings.', price: 199, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop', isVeg: false, sortOrder: 2 },
        { categoryId: 'cat-3', name: 'Hyderabadi Chicken Biryani', description: 'Authentic dum biryani.', price: 349, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', isVeg: false, sortOrder: 1 },
        { categoryId: 'cat-4', name: 'Chocolate Lava Cake', description: 'Warm cake with a gooey center.', price: 129, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop', isVeg: true, sortOrder: 1 }
    ];
    for (const m of menuItems) {
        const id = 'menu-' + Math.random().toString(36).substr(2, 9);
        await prisma.menuItem.create({ data: { id, ...m } });
    }

    const offers = [
        { id: 'offer-1', title: 'BUY 1 GET 1 FREE', subtitle: 'ON ALL PIZZAS', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=300&fit=crop', bgColor: '#4338ca', active: true },
        { id: 'offer-2', title: 'FLAT 50% OFF', subtitle: 'ON DESSERTS', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=300&fit=crop', bgColor: '#7c3aed', active: true }
    ];
    for (const o of offers) {
        await prisma.offer.upsert({ where: { id: o.id }, update: {}, create: o });
    }

    const collections = [
        { id: 'col-1', title: 'Weekend Specials at ₹99', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', link: '/menu' },
        { id: 'col-2', title: 'Bestseller Combos', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', link: '/menu' }
    ];
    for (const c of collections) {
        await prisma.collection.upsert({ where: { id: c.id }, update: {}, create: c });
    }

    const eliteItems = [
        { id: 'elite-1', label: 'Above ₹449', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', sortOrder: 1 }
    ];
    for (const i of eliteItems) {
        await prisma.eliteItem.upsert({ where: { id: i.id }, update: {}, create: i });
    }

    await prisma.coupon.upsert({
        where: { code: 'FC50' }, update: {},
        create: { code: 'FC50', discountType: 'PERCENTAGE', discountValue: 50, maxDiscount: 100, minOrderValue: 200 }
    });

    console.log('✅ Single restaurant items seeded!');
}

main()
    .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
