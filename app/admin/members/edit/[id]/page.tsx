'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface EditMemberPageProps {
    params: Promise<{ id: string }>;
}

export default function EditMemberPage({ params }: EditMemberPageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Initial state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'member',
        year: '',
        bio: '',
        websiteUrl: '',
        githubUrl: '',
        researchInterests: '',
    });

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const res = await fetch(`/api/members/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        role: data.role || 'member',
                        year: data.year || '',
                        bio: data.bio || '',
                        websiteUrl: data.websiteUrl || '',
                        githubUrl: data.githubUrl || '',
                        researchInterests: Array.isArray(data.researchInterests)
                            ? data.researchInterests.join(', ')
                            : '',
                    });
                } else {
                    alert('Failed to fetch member details');
                    router.push('/admin/members');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred fetching member details');
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/members/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    researchInterests: formData.researchInterests.split(',').map(i => i.trim()).filter(Boolean),
                }),
            });

            if (res.ok) {
                router.push('/admin/members');
                router.refresh();
            } else {
                alert('Failed to update member');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred updating member');
        } finally {
            setSaving(false);
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
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Member</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                            className="input-field"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="member">Member</option>
                            <option value="organizer">Organizer</option>
                            <option value="advisor">Faculty Advisor</option>
                            <option value="alumni">Alumni</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title/Year</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g., PhD Student"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Research Interests</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Separate with commas (e.g., ZK Proofs, MPC, Lattices)"
                            value={formData.researchInterests}
                            onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                            className="input-field"
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="https://..."
                            value={formData.websiteUrl}
                            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="https://github.com/..."
                            value={formData.githubUrl}
                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn-secondary mr-4"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
