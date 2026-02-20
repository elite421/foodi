import prisma from './prisma';
import { getAllSiteData } from './db';

// Legacy compatibility — used by server components (async)
export async function readData() {
    return getAllSiteData();
}

// Categories
export async function getCategories() {
    return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
}
export async function addCategory(data) {
    return prisma.category.create({ data });
}
export async function updateCategory(id, data) {
    return prisma.category.update({ where: { id }, data });
}
export async function deleteCategory(id) {
    return prisma.category.delete({ where: { id } });
}

// Menu Items
export async function getMenuItems() {
    return prisma.menuItem.findMany({ orderBy: { sortOrder: 'asc' }, include: { category: true } });
}
export async function addMenuItem(data) {
    return prisma.menuItem.create({ data });
}
export async function updateMenuItem(id, data) {
    return prisma.menuItem.update({ where: { id }, data });
}
export async function deleteMenuItem(id) {
    return prisma.menuItem.delete({ where: { id } });
}

// Coupons
export async function getCoupons() {
    return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
}
export async function addCoupon(data) {
    return prisma.coupon.create({ data });
}
export async function updateCoupon(id, data) {
    return prisma.coupon.update({ where: { id }, data });
}
export async function deleteCoupon(id) {
    return prisma.coupon.delete({ where: { id } });
}

// Orders
export async function getOrders() {
    return prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, address: true, items: { include: { menuItem: true } } }
    });
}
export async function updateOrderStatus(id, status) {
    return prisma.order.update({ where: { id }, data: { status } });
}

// Offers
export async function getOffers() {
    return prisma.offer.findMany();
}
export async function addOffer(data) {
    return prisma.offer.create({ data });
}
export async function updateOffer(id, data) {
    return prisma.offer.update({ where: { id }, data });
}
export async function deleteOffer(id) {
    return prisma.offer.delete({ where: { id } });
}

// Collections
export async function getCollections() {
    return prisma.collection.findMany();
}
export async function addCollection(data) {
    return prisma.collection.create({ data });
}
export async function updateCollection(id, data) {
    return prisma.collection.update({ where: { id }, data });
}
export async function deleteCollection(id) {
    return prisma.collection.delete({ where: { id } });
}

// Hero
export async function getHero() {
    return prisma.hero.findFirst({ where: { id: 1 } });
}
export async function updateHero(data) {
    return prisma.hero.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data }
    });
}

// Elite
export async function getElite() {
    const [elite, items] = await Promise.all([
        prisma.elite.findFirst({ where: { id: 1 } }),
        prisma.eliteItem.findMany({ orderBy: { sortOrder: 'asc' } })
    ]);
    return { ...elite, items };
}
export async function updateElite(data) {
    return prisma.elite.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data }
    });
}
export async function addEliteItem(data) {
    return prisma.eliteItem.create({ data });
}
export async function deleteEliteItem(id) {
    return prisma.eliteItem.delete({ where: { id } });
}

// Settings
export async function getSettings() {
    return prisma.settings.findFirst({ where: { id: 1 } });
}
export async function updateSettings(data) {
    return prisma.settings.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data }
    });
}
