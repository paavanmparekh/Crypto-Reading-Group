'use client';

import Image from 'next/image';
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
    const [formData, setFormData] = useState({
        name: '',
        websiteUrl: '',
        photoUrl: '',
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const res = await fetch(`/api/members/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || '',
                        websiteUrl: data.websiteUrl || '',
                        photoUrl: data.photoUrl || '',
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

        const body = new FormData();
        body.append('name', formData.name);
        body.append('websiteUrl', formData.websiteUrl);

        if (photoFile) {
            body.append('photo', photoFile);
        }

        try {
            const res = await fetch(`/api/members/${id}`, {
                method: 'PATCH',
                body,
            });

            if (res.ok) {
                router.push('/admin/members');
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update member');
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
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Member</h1>

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
                    {formData.photoUrl && (
                        <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            <Image
                                src={formData.photoUrl}
                                alt={`${formData.name} profile photo`}
                                fill
                                sizes="160px"
                                unoptimized
                                className="object-cover"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                    <p className="mt-2 text-sm text-gray-500">Optional. Choose a new image under 1 MB only if you want to replace the current one.</p>
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
