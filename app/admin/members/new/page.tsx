'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'member',
        year: 'PhD Student',
        bio: '',
        websiteUrl: '',
        githubUrl: '',
        researchInterests: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    // Split comma-separated interests into array
                    researchInterests: formData.researchInterests.split(',').map(i => i.trim()).filter(Boolean),
                }),
            });

            if (res.ok) {
                router.push('/admin/members');
                router.refresh();
            } else {
                alert('Failed to create member');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Member</h1>

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
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Creating...' : 'Add Member'}
                    </button>
                </div>
            </form>
        </div>
    );
}
