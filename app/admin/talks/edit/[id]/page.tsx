'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface EditTalkPageProps {
    params: Promise<{ id: string }>;
}

export default function EditTalkPage({ params }: EditTalkPageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Initial state
    const [formData, setFormData] = useState({
        title: '',
        speaker: '',
        speakerAffiliation: '',
        date: '',
        time: '',
        location: '',
        abstract: '',
        zoomLink: '',
        semester: 'Spring 2026',
        paperTitle: '',
        paperLink: '',
        slidesUrl: '',
        videoUrl: '',
        isUpcoming: true, // Need to handle this too
    });

    useEffect(() => {
        const fetchTalk = async () => {
            try {
                // We'll assume GET /api/talks returns list, so we might need GET /api/talks/[id] 
                // Wait, GET /api/talks/[id] doesn't exist? 
                // I need to create GET in app/api/talks/[id]/route.ts

                // Let's assume I will create it. 
                const res = await fetch(`/api/talks/${id}`);
                if (res.ok) {
                    const data = await res.json();

                    // Format date to YYYY-MM-DD for input type="date"
                    const dateObj = new Date(data.date);
                    const dateStr = dateObj.toISOString().split('T')[0];

                    setFormData({
                        title: data.title || '',
                        speaker: data.speaker || '',
                        speakerAffiliation: data.speakerAffiliation || '',
                        date: dateStr,
                        time: data.time || '',
                        location: data.location || '',
                        abstract: data.abstract || '',
                        zoomLink: data.zoomLink || '',
                        semester: data.semester || 'Spring 2026',
                        paperTitle: data.paperTitle || '',
                        paperLink: data.paperLink || '',
                        slidesUrl: data.slidesUrl || '',
                        videoUrl: data.videoUrl || '',
                        isUpcoming: data.isUpcoming ?? true,
                    });
                } else {
                    alert('Failed to fetch talk details');
                    router.push('/admin/talks');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred fetching talk details');
            } finally {
                setLoading(false);
            }
        };

        fetchTalk();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/talks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/talks');
                router.refresh();
            } else {
                alert('Failed to update talk');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred updating talk');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Talk</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Core Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.speaker}
                            onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Affiliation</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.speakerAffiliation}
                            onChange={(e) => setFormData({ ...formData, speakerAffiliation: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            required
                            className="input-field"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <select
                            className="input-field"
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        >
                            <option>Spring 2026</option>
                            <option>Fall 2025</option>
                            <option>Spring 2025</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
                        <textarea
                            required
                            rows={4}
                            className="input-field"
                            value={formData.abstract}
                            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                        />
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-4">Resources & Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Link</label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="https://zoom.us/..."
                            value={formData.zoomLink}
                            onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paper Title</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Optional paper title"
                            value={formData.paperTitle}
                            onChange={(e) => setFormData({ ...formData, paperTitle: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paper Link (URL)</label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="https://..."
                            value={formData.paperLink}
                            onChange={(e) => setFormData({ ...formData, paperLink: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slides URL</label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="https://..."
                            value={formData.slidesUrl}
                            onChange={(e) => setFormData({ ...formData, slidesUrl: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video/Recording URL</label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="https://youtube.com/..."
                            value={formData.videoUrl}
                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
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
