import bcrypt from 'bcryptjs';
import { prisma } from './db';

export async function verifyAdmin(email: string, password: string) {
    const admin = await prisma.admin.findUnique({
        where: { email },
    });

    if (!admin) {
        return null;
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
        return null;
    }

    return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
    };
}

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}
