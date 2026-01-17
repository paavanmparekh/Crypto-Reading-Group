import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const messages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Inbox</h1>
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {messages.length} Messages
                </span>
            </div>

            <div className="space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">No messages found.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{msg.name}</h3>
                                        <a href={`mailto:${msg.email}`} className="text-sm text-gray-500 hover:text-primary-600 hover:underline">
                                            {msg.email}
                                        </a>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-400">
                                    {new Date(msg.createdAt).toLocaleString(undefined, {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </span>
                            </div>

                            <div className="pl-13 md:pl-13 mb-4">
                                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {msg.message}
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                                <a
                                    href={`mailto:${msg.email}?subject=Re: Inquiry via Contact Form&body=\n\nOn ${new Date(msg.createdAt).toLocaleDateString()}, ${msg.name} wrote:\n> ${msg.message.replace(/\n/g, '\n> ')}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
