import { prisma } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 0; // Revalidate immediately

export default async function DashboardPage() {
    let talksCount = 0;
    let membersCount = 0;
    let subscribersCount = 0;
    let upcomingTalks: any[] = [];

    try {
        [talksCount, membersCount] = await Promise.all([
            prisma.talk.count(),
            prisma.member.count(),
        ]);

        upcomingTalks = await prisma.talk.findMany({
            where: { date: { gte: new Date() } }, // Filter by date instead of isUpcoming flag
            orderBy: { date: 'asc' },
            take: 3,
        });
    } catch (e) {
        console.warn("Database connection failed, showing empty dashboard");
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="card border-l-4 border-primary-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Talks</p>
                            <h3 className="text-3xl font-bold text-gray-900">{talksCount}</h3>
                        </div>
                        <span className="text-2xl">🎤</span>
                    </div>
                </div>

                <div className="card border-l-4 border-accent-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Active Members</p>
                            <h3 className="text-3xl font-bold text-gray-900">{membersCount}</h3>
                        </div>
                        <span className="text-2xl">👥</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/talks/new"
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 group-hover:bg-primary-200">
                                +
                            </span>
                            <span className="font-medium text-gray-700">Add New Talk</span>
                        </Link>
                        <Link
                            href="/admin/members/new"
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                            <span className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mr-3 group-hover:bg-accent-200">
                                +
                            </span>
                            <span className="font-medium text-gray-700">Add New Member</span>
                        </Link>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Schedule</h2>
                    {upcomingTalks.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingTalks.map((talk) => (
                                <div key={talk.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{talk.title}</h4>
                                            <p className="text-sm text-gray-600">{talk.speaker}</p>
                                        </div>
                                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                                            {new Date(talk.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No upcoming talks scheduled</p>
                    )}
                </div>
            </div>
        </div>
    );
}
