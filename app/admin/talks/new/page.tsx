'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTalkPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        speaker: '',
        speakerAffiliation: '',
        date: '',
        time: '',
        location: '',
        abstract: '',
        zoomLink: '',
        paperTitle: '',
        paperLink: '',
        slidesUrl: '',
        videoUrl: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/talks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/talks');
                router.refresh();
            } else {
                const data = await res.json();
                alert(`Failed to create talk: ${data.details || data.error || 'Unknown error'}`);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Talk</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-6">
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
                            placeholder="e.g., 2:00 PM"
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
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Creating...' : 'Create Talk'}
                    </button>
                </div>
            </form>
        </div>
    );
}
