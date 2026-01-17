'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Member {
    id: string;
    name: string;
    role: string;
    year?: string;
}

export default function MembersManagementPage() {
    const router = useRouter();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/members');
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (e) {
            console.error("Failed to fetch members", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove "${name}"?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/members/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchMembers();
                alert('Member removed successfully');
            } else {
                alert('Failed to remove member');
            }
        } catch (error) {
            console.error('Error removing member:', error);
            alert('An error occurred');
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Members</h1>
                <Link href="/admin/members/new" className="btn-primary">
                    + Add New Member
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <div key={member.id} className="bg-white rounded-xl shadow p-6 flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                {member.name[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3 text-sm font-medium">
                            <button
                                onClick={() => router.push(`/admin/members/edit/${member.id}`)}
                                className="text-primary-600 hover:text-primary-800"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(member.id, member.name)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <Link
                    href="/admin/members/new"
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors bg-gray-50 hover:bg-white min-h-[160px]"
                >
                    <span className="text-4xl mb-2">+</span>
                    <span className="font-medium">Add Member</span>
                </Link>
            </div>
        </div>
    );
}
