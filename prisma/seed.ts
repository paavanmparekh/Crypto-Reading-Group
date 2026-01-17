import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Admin User
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.admin.upsert({
        where: { email: 'admin@crg.com' },
        update: {},
        create: {
            email: 'admin@crg.com',
            password: hashedPassword,
            name: 'Admin User',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create Sample Members
    console.log('Creating sample members...');

    const members = await Promise.all([
        prisma.member.upsert({
            where: { email: 'alice@cs.stonybrook.edu' },
            update: {},
            create: {
                name: 'Alice Johnson',
                email: 'alice@cs.stonybrook.edu',
                role: 'organizer',
                year: '4th Year PhD',
                researchInterests: ['Zero-Knowledge Proofs', 'Secure Multi-Party Computation', 'Privacy-Preserving Protocols'],
                websiteUrl: 'https://example.com/alice',
                bio: 'Alice is a PhD student researching zero-knowledge proofs and their applications in blockchain systems.',
                talksGiven: 3,
                isActive: true,
            },
        }),
        prisma.member.upsert({
            where: { email: 'bob@cs.stonybrook.edu' },
            update: {},
            create: {
                name: 'Bob Smith',
                email: 'bob@cs.stonybrook.edu',
                role: 'organizer',
                year: '3rd Year PhD',
                researchInterests: ['Post-Quantum Cryptography', 'Lattice-Based Cryptography'],
                websiteUrl: 'https://example.com/bob',
                bio: 'Bob focuses on post-quantum cryptographic primitives and their practical implementations.',
                talksGiven: 2,
                isActive: true,
            },
        }),
        prisma.member.upsert({
            where: { email: 'carol@cs.stonybrook.edu' },
            update: {},
            create: {
                name: 'Carol Williams',
                email: 'carol@cs.stonybrook.edu',
                role: 'member',
                year: '2nd Year PhD',
                researchInterests: ['Homomorphic Encryption', 'Functional Encryption'],
                bio: 'Carol is interested in advanced encryption schemes and their applications.',
                talksGiven: 1,
                isActive: true,
            },
        }),
        prisma.member.upsert({
            where: { email: 'dave@cs.stonybrook.edu' },
            update: {},
            create: {
                name: 'David Brown',
                email: 'dave@cs.stonybrook.edu',
                role: 'member',
                year: '1st Year PhD',
                researchInterests: ['Blockchain Security', 'Consensus Protocols'],
                isActive: true,
            },
        }),
        prisma.member.upsert({
            where: { email: 'prof.smith@cs.stonybrook.edu' },
            update: {},
            create: {
                name: 'Prof. Emily Smith',
                email: 'prof.smith@cs.stonybrook.edu',
                role: 'advisor',
                researchInterests: ['Cryptographic Protocols', 'Network Security', 'Applied Cryptography'],
                websiteUrl: 'https://example.com/prof-smith',
                bio: 'Professor Smith leads the cryptography research group and has 20+ years of experience in the field.',
                isActive: true,
            },
        }),
    ]);
    console.log(`✅ Created ${members.length} members`);

    // Create Sample Upcoming Talks
    console.log('Creating upcoming talks...');

    const upcomingTalks = await Promise.all([
        prisma.talk.create({
            data: {
                title: 'Introduction to Zero-Knowledge Proofs',
                abstract: 'This talk will cover the fundamentals of zero-knowledge proofs, including interactive and non-interactive variants. We will explore SNARKs, STARKs, and their applications in modern blockchain systems.',
                speaker: 'Alice Johnson',
                speakerAffiliation: 'Stony Brook University',
                date: new Date('2026-01-24T14:00:00'),
                time: '2:00 PM - 3:00 PM',
                location: 'CS Building, Room 2311',
                zoomLink: 'https://zoom.us/j/example123',
                paperTitle: 'Succinct Non-Interactive Zero Knowledge for a von Neumann Architecture',
                paperLink: 'https://eprint.iacr.org/2013/879',
                tags: ['Zero-Knowledge', 'SNARKs', 'Blockchain'],
                semester: 'Spring 2026',
                isUpcoming: true,
            },
        }),
        prisma.talk.create({
            data: {
                title: 'Post-Quantum Cryptography: Preparing for the Quantum Era',
                abstract: 'An overview of post-quantum cryptographic algorithms, focusing on lattice-based schemes selected by NIST. We will discuss implementation challenges and migration strategies.',
                speaker: 'Bob Smith',
                speakerAffiliation: 'Stony Brook University',
                date: new Date('2026-01-31T14:00:00'),
                time: '2:00 PM - 3:00 PM',
                location: 'CS Building, Room 2311',
                zoomLink: 'https://zoom.us/j/example456',
                paperTitle: 'CRYSTALS-Kyber: A CCA-Secure Module-Lattice-Based KEM',
                paperLink: 'https://eprint.iacr.org/2017/634',
                tags: ['Post-Quantum', 'Lattices', 'NIST'],
                semester: 'Spring 2026',
                isUpcoming: true,
            },
        }),
    ]);
    console.log(`✅ Created ${upcomingTalks.length} upcoming talks`);

    // Create Sample Past Talks
    console.log('Creating past talks...');

    const pastTalks = await Promise.all([
        prisma.talk.create({
            data: {
                title: 'Secure Multi-Party Computation: Theory and Practice',
                abstract: 'This talk explored the foundations of secure multi-party computation (MPC) and discussed recent advances in practical MPC protocols.',
                speaker: 'Alice Johnson',
                speakerAffiliation: 'Stony Brook University',
                date: new Date('2025-12-06T14:00:00'),
                time: '2:00 PM - 3:00 PM',
                location: 'CS Building, Room 2311',
                paperTitle: 'Practical Secure Computation Outsourcing: A Survey',
                paperLink: 'https://dl.acm.org/doi/10.1145/3158363',
                slidesUrl: 'https://example.com/slides/mpc-talk.pdf',
                videoUrl: 'https://youtube.com/watch?v=example',
                tags: ['MPC', 'Secure Computation', 'Privacy'],
                semester: 'Fall 2025',
                isUpcoming: false,
            },
        }),
        prisma.talk.create({
            data: {
                title: 'Homomorphic Encryption and Its Applications',
                abstract: 'An introduction to fully homomorphic encryption (FHE) and its potential applications in cloud computing and privacy-preserving machine learning.',
                speaker: 'Carol Williams',
                speakerAffiliation: 'Stony Brook University',
                date: new Date('2025-11-15T14:00:00'),
                time: '2:00 PM - 3:00 PM',
                location: 'CS Building, Room 2311',
                paperTitle: 'Fully Homomorphic Encryption without Bootstrapping',
                paperLink: 'https://eprint.iacr.org/2011/277',
                slidesUrl: 'https://example.com/slides/fhe-talk.pdf',
                tags: ['Homomorphic Encryption', 'FHE', 'Privacy'],
                semester: 'Fall 2025',
                isUpcoming: false,
            },
        }),
        prisma.talk.create({
            data: {
                title: 'Blockchain Consensus Mechanisms',
                abstract: 'A comprehensive overview of consensus mechanisms in blockchain systems, from Proof-of-Work to modern Byzantine Fault Tolerant protocols.',
                speaker: 'David Brown',
                speakerAffiliation: 'Stony Brook University',
                date: new Date('2025-10-18T14:00:00'),
                time: '2:00 PM - 3:00 PM',
                location: 'CS Building, Room 2311',
                paperTitle: 'The Bitcoin Backbone Protocol: Analysis and Applications',
                paperLink: 'https://eprint.iacr.org/2014/765',
                tags: ['Blockchain', 'Consensus', 'Byzantine Fault Tolerance'],
                semester: 'Fall 2025',
                isUpcoming: false,
            },
        }),
    ]);
    console.log(`✅ Created ${pastTalks.length} past talks`);

    // Create Sample Subscribers
    console.log('Creating sample subscribers...');

    const subscribers = await Promise.all([
        prisma.subscriber.upsert({
            where: { email: 'subscriber1@example.com' },
            update: {},
            create: {
                email: 'subscriber1@example.com',
                name: 'John Doe',
                isActive: true,
            },
        }),
        prisma.subscriber.upsert({
            where: { email: 'subscriber2@example.com' },
            update: {},
            create: {
                email: 'subscriber2@example.com',
                name: 'Jane Smith',
                isActive: true,
            },
        }),
    ]);
    console.log(`✅ Created ${subscribers.length} subscribers`);

    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
