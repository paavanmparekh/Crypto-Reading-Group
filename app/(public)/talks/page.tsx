import Link from 'next/link';
import { prisma } from '@/lib/db';

export const revalidate = 0; // Revalidate immediately

interface Talk {
    id: string;
    title: string;
    speaker: string;
    speakerAffiliation: string | null;
    date: Date;
    time: string;
    location: string;
    abstract: string;
    zoomLink: string | null;
    paperTitle: string | null;
    paperLink: string | null;
    slidesUrl: string | null;
    videoUrl: string | null;
    isUpcoming: boolean;
}

export default async function TalksPage() {
    let talks: Talk[] = [];
    try {
        talks = await prisma.talk.findMany({
            orderBy: { date: 'desc' }
        });
    } catch (e) {
        console.warn("Database connection failed");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-crypto-theme text-white py-16">
                <div className="section-container text-center">
                    <h1 className="text-5xl font-bold mb-4">Talks Archive</h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                        Browse our archive of presentations on cutting-edge cryptography
                    </p>
                </div>
            </section>

            <div className="section-container">
                <div className="max-w-4xl mx-auto space-y-8">
                    {talks.map((talk) => (
                        <div key={talk.id} className="card hover:border-primary-200 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                            {new Date(talk.date).toLocaleDateString()}
                                        </span>
                                        {talk.isUpcoming && (
                                            <span className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                                Upcoming
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                        {talk.title}
                                    </h2>
                                    <p className="text-lg text-gray-700 font-medium">
                                        {talk.speaker}
                                        {talk.speakerAffiliation && <span className="text-gray-500 font-normal">, {talk.speakerAffiliation}</span>}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                        <span className="flex items-center gap-1">📍 {talk.location}</span>
                                        <span className="flex items-center gap-1">🕒 {talk.time}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6">
                                {talk.abstract}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 relative z-10">
                                {talk.slidesUrl ? (
                                    <a href={talk.slidesUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 font-medium">
                                        📄 View Slides
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                        📄 Slides
                                    </span>
                                )}

                                {talk.paperLink ? (
                                    <a href={talk.paperLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 font-medium">
                                        📝 {talk.paperTitle ? `Paper: ${talk.paperTitle}` : 'Read Paper'}
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                        📝 Paper
                                    </span>
                                )}

                                {talk.videoUrl ? (
                                    <a href={talk.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-700 hover:text-primary-900 font-medium">
                                        🎥 Watch Recording
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                        🎥 Recording
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {talks.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-500 text-lg">No talks scheduled yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
