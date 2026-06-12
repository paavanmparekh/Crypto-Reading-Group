import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { put } from '@vercel/blob';

async function uploadMemberPhoto(photo: FormDataEntryValue | null) {
    if (!(photo instanceof File) || photo.size === 0) {
        return null;
    }

    if (!photo.type.startsWith('image/')) {
        throw new Error('Profile image must be an image file');
    }

    const extension = photo.name.split('.').pop() || 'jpg';
    const blob = await put(`members/${crypto.randomUUID()}.${extension}`, photo, {
        access: 'public',
    });

    return blob.url;
}

export async function GET() {
    try {
        const members = await prisma.member.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.formData();
        const name = body.get('name')?.toString().trim();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const photoUrl = await uploadMemberPhoto(body.get('photo'));
        const member = await prisma.member.create({
            data: {
                name,
                email: `member-${crypto.randomUUID()}@internal.local`,
                photoUrl,
                role: 'member',
                researchInterests: [],
                websiteUrl: body.get('websiteUrl')?.toString().trim() || null,
                isActive: true,
            },
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error creating member:', error);
        if (error instanceof Error && error.message.includes('Profile image')) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
    }
}
