'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Talk {
    id: string;
    title: string;
    speaker: string;
    date: Date;
    isUpcoming: boolean;
}

export default function TalksManagementPage() {
    const router = useRouter();
    const [talks, setTalks] = useState<Talk[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTalks = async () => {
        try {
            const res = await fetch('/api/talks');
            if (res.ok) {
                const data = await res.json();
                setTalks(data);
            }
        } catch (e) {
            console.error("Failed to fetch talks", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTalks();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/talks/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Refresh the talks list
                await fetchTalks();
                alert('Talk deleted successfully');
            } else {
                alert('Failed to delete talk');
            }
        } catch (error) {
            console.error('Error deleting talk:', error);
            alert('An error occurred while deleting the talk');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Talks</h1>
                <Link href="/admin/talks/new" className="btn-primary">
                    + Add New Talk
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Speaker
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {talks.map((talk) => (
                            <tr key={talk.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(talk.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {talk.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {talk.speaker}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(talk.date) > new Date() ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Upcoming
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            Past
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => router.push(`/admin/talks/edit/${talk.id}`)}
                                        className="text-primary-600 hover:text-primary-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(talk.id, talk.title)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {talks.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No talks found. Click "Add New Talk" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
