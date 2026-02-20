import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// ------ Admin Auth ------

export async function loginAdmin(username, password) {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !bcrypt.compareSync(password, admin.password)) return null;

    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({ data: { id: sessionId, adminId: admin.id, expiresAt: expires } });
    await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });

    return { sessionId, admin: { id: admin.id, username: admin.username, name: admin.name }, expires };
}

export async function verifyAdminSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('fc_session')?.value;
    if (!sessionId) return null;

    const session = await prisma.session.findFirst({
        where: { id: sessionId, adminId: { not: null }, expiresAt: { gt: new Date() } },
        include: { admin: true }
    });
    if (!session || !session.admin) return null;
    return { id: session.admin.id, username: session.admin.username, name: session.admin.name };
}

// ------ Compatibility Alias ------
export async function verifySession() {
    return verifyAdminSession();
}
export async function login(username, password) {
    return loginAdmin(username, password);
}

// ------ User Auth ------

function generateUserId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 10; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
}

export async function sendOtp(phone) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.otp.upsert({
        where: { phone },
        update: { code, expiresAt },
        create: { phone, code, expiresAt }
    });

    console.log(`[DEV ONLY] OTP for ${phone}: ${code}`);

    const user = await prisma.user.findUnique({ where: { phone } });
    return { success: true, userExists: !!user };
}

export async function registerUser(phone, otp, name, email) {
    const otpRecord = await prisma.otp.findUnique({ where: { phone } });
    if (!otpRecord || otpRecord.code !== otp || otpRecord.expiresAt < new Date()) {
        throw new Error('Invalid or expired OTP');
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new Error('Email already registered');

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) throw new Error('Phone number already registered');

    const user = await prisma.user.create({
        data: { id: generateUserId(), name, email, phone }
    });

    await prisma.otp.delete({ where: { phone } });

    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await prisma.session.create({ data: { id: sessionId, userId: user.id, expiresAt: expires } });

    return { sessionId, user: { id: user.id, name: user.name, email: user.email, phone: user.phone }, expires };
}

export async function loginUser(phone, otp) {
    const otpRecord = await prisma.otp.findUnique({ where: { phone } });
    if (!otpRecord || otpRecord.code !== otp || otpRecord.expiresAt < new Date()) {
        return null;
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return null;

    await prisma.otp.delete({ where: { phone } });

    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.create({ data: { id: sessionId, userId: user.id, expiresAt: expires } });
    await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });

    return { sessionId, user: { id: user.id, name: user.name, email: user.email, phone: user.phone }, expires };
}

export async function verifyUserSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('fc_user_session')?.value;
    if (!sessionId) return null;

    const session = await prisma.session.findFirst({
        where: { id: sessionId, userId: { not: null }, expiresAt: { gt: new Date() } },
        include: { user: true }
    });
    if (!session || !session.user) return null;
    return { id: session.user.id, name: session.user.name, email: session.user.email, phone: session.user.phone };
}

// ------ Generic Logout ------
export async function logout(isUser = false) {
    const cookieStore = await cookies();
    const cookieName = isUser ? 'fc_user_session' : 'fc_session';
    const sessionId = cookieStore.get(cookieName)?.value;
    if (sessionId) {
        await prisma.session.deleteMany({ where: { id: sessionId } });
    }
}
