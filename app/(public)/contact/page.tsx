'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeName, setSubscribeName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        /*
        e.preventDefault();
        setSubscribeStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: subscribeEmail, name: subscribeName }),
            });

            if (res.ok) {
                setSubscribeStatus('success');
                setSubscribeEmail('');
                setSubscribeName('');
            } else {
                const data = await res.json();
                setSubscribeStatus('error');
                setErrorMessage(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            setSubscribeStatus('error');
            setErrorMessage('An error occurred. Please try again.');
        }
        */
        console.log("Subscription disabled");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-crypto-theme text-white py-16">
                <div className="section-container text-center">
                    <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                        Get in touch or join our mailing list for updates
                    </p>
                </div>
            </section>

            <div className="section-container">
                <div className="max-w-3xl mx-auto">
                    {/* Mailing List */}
                    {/* Mailing List (Disabled)
                    <div className="card-glass">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Join Our Mailing List
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Subscribe to receive updates about upcoming talks, new papers, and group activities.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div>
                                <label htmlFor="subscribe-name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="subscribe-name"
                                    value={subscribeName}
                                    onChange={(e) => setSubscribeName(e.target.value)}
                                    className="input-field"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="subscribe-email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="subscribe-email"
                                    value={subscribeEmail}
                                    onChange={(e) => setSubscribeEmail(e.target.value)}
                                    required
                                    className="input-field"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={subscribeStatus === 'loading'}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                            {subscribeStatus === 'success' && (
                                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                                    Successfully subscribed!
                                </div>
                            )}
                            {subscribeStatus === 'error' && (
                                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                    {errorMessage}
                                </div>
                            )}
                        </form>
                    </div>
                    */}

                    {/* Contact Form */}
                    <div className="card-glass">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Send Us a Message
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Have questions or want to get involved? We'd love to hear from you!
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="input-field"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="input-field"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={5}
                                    className="input-field resize-none"
                                    placeholder="Your message..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </button>
                            {status === 'success' && (
                                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                                    Message sent successfully! We'll get back to you soon.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                    Failed to send message. Please try again.
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Meeting Info */}
                <div className="max-w-6xl mx-auto mt-12">
                    <div className="card-glass">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Meeting Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-primary-100 text-primary-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">When</h3>
                                <p className="text-gray-700">Weekly Meetings</p>
                                <p className="text-gray-600 text-sm">Every Friday at 9:00 PM</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary-100 text-primary-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Where</h3>
                                <p className="text-gray-700">Stony Brook University</p>
                                <p className="text-gray-600 text-sm">Computer Science Department</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary-100 text-primary-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                                <a href="mailto:pmparekh@cs.stonybrook.edu" className="text-primary-600 hover:text-primary-700">
                                    pmparekh@cs.stonybrook.edu
                                </a>
                                <p className="text-gray-600 text-sm">+1 (934) 255-3277</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
