import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

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
        const body = await req.json();
        const member = await prisma.member.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                year: body.year,
                researchInterests: body.researchInterests || [],
                bio: body.bio,
                websiteUrl: body.websiteUrl,
                githubUrl: body.githubUrl,
                isActive: true,
            },
        });

        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
    }
}
