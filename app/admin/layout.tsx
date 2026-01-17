'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // If we are on the login page, just render children
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Protect admin routes
    if (status === 'unauthenticated') {
        router.push('/admin/login');
        return null;
    }

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/admin/talks', label: 'Manage Talks', icon: '🎤' },
        { href: '/admin/members', label: 'Manage Members', icon: '👥' },
        { href: '/admin/messages', label: 'Messages', icon: '✉️' },
        { href: '/', label: 'View Site', icon: '🌐' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                    } flex flex-col fixed h-full z-20`}
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-800">
                    {isSidebarOpen && <span className="font-bold text-xl">Admin Panel</span>}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {isSidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold">
                            {session?.user?.name?.[0] || 'A'}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'
                    } p-8`}
            >
                {children}
            </main>
        </div>
    );
}
