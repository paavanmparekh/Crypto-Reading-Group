'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        websiteUrl: '',
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const body = new FormData();
        body.append('name', formData.name);
        body.append('websiteUrl', formData.websiteUrl);

        if (photoFile) {
            body.append('photo', photoFile);
        }

        try {
            const res = await fetch('/api/members', {
                method: 'POST',
                body,
            });

            if (res.ok) {
                router.push('/admin/members');
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create member');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Member</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-6">
                <div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                    <p className="mt-2 text-sm text-gray-500">Optional. Upload a square or portrait image under 1 MB.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Homepage Link</label>
                    <input
                        type="url"
                        className="input-field"
                        placeholder="https://..."
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    />
                    <p className="mt-2 text-sm text-gray-500">Optional. The member name will link here on the Members page.</p>
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
