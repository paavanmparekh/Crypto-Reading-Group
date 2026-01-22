import { prisma } from '@/lib/db';

export const revalidate = 0; // Revalidate immediately
export default async function PeoplePage() {
    //     const members = [
    // ... (Removing hardcoded data)
    //     ];

    const allMembers = await prisma.member.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    });

    const advisor = allMembers.find(m => m.role === 'Faculty Advisor') || {
        name: 'Prof. Omkant Pandey', // Fallback
        role: 'Faculty Advisor',
        bio: '',
        researchInterests: ['Cryptography', 'Complexity Theory', 'Zero Knowledge Proof', 'Multi-Party Computation'],
        websiteUrl: 'https://www3.cs.stonybrook.edu/~omkant/',
    };

    const members = allMembers.filter(m => m.role !== 'Faculty Advisor');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ... Header ... */}
            <section className="bg-crypto-theme text-white py-16">
                <div className="section-container text-center">
                    <h1 className="text-5xl font-bold mb-4">Our Team</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Meet the researchers and students driving cryptography research forward
                    </p>
                </div>
            </section>

            {/* Faculty Advisor */}
            <section className="section-container">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Faculty Advisor
                </h2>
                <div className="max-w-4xl mx-auto">
                    <div className="card-glass">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                                {advisor.name === 'Prof. Omkant Pandey' ? 'OP' : advisor.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {advisor.name}
                                </h3>
                                <p className="text-primary-600 font-medium mb-3">{advisor.role}</p>
                                {advisor.bio && <p className="text-gray-700 mb-4">{advisor.bio}</p>}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Research Interests:</h4>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {advisor.researchInterests.map((interest: string) => (
                                            <span
                                                key={interest}
                                                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {advisor.websiteUrl && (
                                    <a
                                        href={advisor.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Members */}
            <section className="section-container">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Group Members
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <div key={member.id} className="card hover:scale-105 transition-transform duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-primary-600 font-medium mb-2">{member.year}</p>
                                {member.role === 'organizer' && (
                                    <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                                        Organizer
                                    </span>
                                )}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                                <div className="mt-auto w-full">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Research Interests:</h4>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {member.researchInterests.map((interest: string) => (
                                            <span
                                                key={interest}
                                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {member.websiteUrl && (
                                <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                                    <a
                                        href={member.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Portfolio / Website
                                    </a>
                                </div>
                            )}
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
