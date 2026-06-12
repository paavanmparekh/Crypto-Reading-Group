import Image from 'next/image';
import { prisma } from '@/lib/db';

export const revalidate = 0; // Revalidate immediately
export default async function MembersPage() {
    const allMembers = await prisma.member.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    });

    const advisor = allMembers.find(m => m.role === 'advisor' || m.role === 'Faculty Advisor') || {
        id: 'faculty-advisor',
        name: 'Prof. Omkant Pandey', // Fallback
        role: 'Faculty Advisor',
        photoUrl: null,
        websiteUrl: 'https://www3.cs.stonybrook.edu/~omkant/',
    };

    const members = allMembers.filter(m => m.role !== 'advisor' && m.role !== 'Faculty Advisor');
    const people = [advisor, ...members];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ... Header ... */}
            <section className="bg-crypto-theme text-white py-16">
                <div className="section-container text-center">
                    <h1 className="text-5xl font-bold mb-4">Members</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Meet the researchers and students driving cryptography research forward
                    </p>
                </div>
            </section>

            {/* Members */}
            <section className="section-container">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {people.map((person) => (
                        <div key={person.id} className="text-center">
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                {person.photoUrl ? (
                                    <Image
                                        src={person.photoUrl}
                                        alt={`${person.name} profile photo`}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                                        unoptimized
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100 text-4xl font-bold text-primary-700">
                                        {person.name.split(' ').map((namePart: string) => namePart[0]).join('')}
                                    </div>
                                )}
                            </div>
                            <h2 className="mt-4 text-lg font-semibold text-gray-900">
                                {person.websiteUrl ? (
                                    <a
                                        href={person.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-900 hover:decoration-primary-600"
                                    >
                                        {person.name}
                                    </a>
                                ) : (
                                    person.name
                                )}
                            </h2>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join CTA */}
            <section className="section-container">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Interested in Joining?</h2>
                    <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                        We welcome PhD students and researchers interested in cryptography to join our reading group
                    </p>
                    <a
                        href="/contact"
                        className="btn-primary bg-white text-primary-700 hover:bg-gray-100"
                    >
                        Get in Touch
                    </a>
                </div>
            </section>
        </div>
    );
}
