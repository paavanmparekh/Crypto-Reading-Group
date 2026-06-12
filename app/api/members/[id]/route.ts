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

    if (photo.size > 1024 * 1024) {
        throw new Error('Profile image must be smaller than 1 MB');
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        const buffer = Buffer.from(await photo.arrayBuffer());
        return `data:${photo.type};base64,${buffer.toString('base64')}`;
    }

    const extension = photo.name.split('.').pop() || 'jpg';
    const blob = await put(`members/${crypto.randomUUID()}.${extension}`, photo, {
        access: 'public',
    });

    return blob.url;
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.member.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
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
        const member = await prisma.member.update({
            where: { id: params.id },
            data: {
                name,
                ...(photoUrl ? { photoUrl } : {}),
                websiteUrl: body.get('websiteUrl')?.toString().trim() || null,
            },
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error updating member:', error);
        if (error instanceof Error && error.message.includes('Profile image')) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const member = await prisma.member.findUnique({
            where: { id: params.id },
        });

        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error fetching member:', error);
        return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
    }
}
