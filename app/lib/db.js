import prisma from './prisma';

export async function getAllSiteData() {
  const [hero, categories, menuItems, offers, collections, elite, eliteItems, settings, coupons] = await Promise.all([
    prisma.hero.findFirst({ where: { id: 1 } }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.menuItem.findMany({ orderBy: { sortOrder: 'asc' }, include: { category: true } }),
    prisma.offer.findMany(),
    prisma.collection.findMany(),
    prisma.elite.findFirst({ where: { id: 1 } }),
    prisma.eliteItem.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.settings.findFirst({ where: { id: 1 } }),
    prisma.coupon.findMany({ where: { isActive: true } })
  ]);

  return {
    hero: hero ? {
      title: hero.title, subtitle: hero.subtitle, promoText: hero.promoText,
      searchPlaceholder: hero.searchPlaceholder,
      stats: { rating: hero.statsRating, downloads: hero.statsDownloads, cities: hero.statsCities },
      bannerOffer: { title: hero.bannerTitle, highlight: hero.bannerHighlight, subtitle: hero.bannerSubtitle }
    } : {},
    categories: categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, image: c.image })),
    menuItems: menuItems.map(m => ({
      id: m.id, categoryId: m.categoryId, categoryName: m.category.name, name: m.name, description: m.description, image: m.image,
      price: m.price, isVeg: m.isVeg, isAvailable: m.isAvailable
    })),
    offers: offers.map(o => ({
      id: o.id, title: o.title, subtitle: o.subtitle,
      image: o.image, bgColor: o.bgColor, active: o.active
    })),
    collections: collections.map(c => ({ id: c.id, title: c.title, image: c.image, link: c.link })),
    coupons: coupons.map(c => ({ id: c.id, code: c.code, discountType: c.discountType, discountValue: c.discountValue })),
    elite: elite ? {
      title: elite.title, tagline: elite.tagline,
      freeDelivery: elite.freeDelivery, freeDishes: elite.freeDishes,
      items: eliteItems.map(i => ({ id: i.id, label: i.label, image: i.image }))
    } : null,
    settings: settings ? {
      siteName: settings.siteName, tagline: settings.tagline, domain: settings.domain,
      phone: settings.phone, email: settings.email, address: settings.address,
      socialLinks: { facebook: settings.facebook, instagram: settings.instagram, twitter: settings.twitter },
      primaryColor: settings.primaryColor, secondaryColor: settings.secondaryColor,
      restaurantLat: settings.restaurantLat, restaurantLng: settings.restaurantLng,
      deliveryRadius: settings.deliveryRadius, taxPercentage: settings.taxPercentage,
      baseDeliveryFee: settings.baseDeliveryFee, razorpayKeyId: settings.razorpayKeyId
    } : {}
  };
}
