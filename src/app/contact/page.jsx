'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ContactUsPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success('Message sent successfully!');
            setForm({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Contact Us</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Have questions? We would love to hear from you.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    {[
                        { icon: FaMapMarkerAlt, title: 'Address', text: '123 Healthcare Avenue, New York, NY 10001' },
                        { icon: FaPhone, title: 'Phone', text: '+1 (800) MEDICARE' },
                        { icon: FaEnvelope, title: 'Email', text: 'info@medicareconnect.com' },
                        { icon: FaClock, title: 'Hours', text: 'Mon - Fri: 8:00 AM - 6:00 PM' },
                    ].map((item) => (
                        <div key={item.title} className="flex items-start gap-4 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
                            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <item.icon className="text-teal-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-slate-900" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-slate-900" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-slate-900" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-slate-900" required />
                        </div>
                        <button type="submit" disabled={loading} className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
