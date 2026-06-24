'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card } from '@heroui/react';
import { FaStar } from 'react-icons/fa';

export default function TestimonialsSection() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:5000/reviews?limit=6')
            .then((res) => {
                setReviews(res.data?.reviews || res.data || []);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary">
                        Testimonials
                    </span>

                    <h2 className="text-5xl font-black mt-5">
                        Patient Success Stories
                    </h2>

                    <p className="text-default-500 mt-4">
                        Hear from patients who trust MediCare Connect.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {reviews.map((review, index) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 h-full">

                                <div className="flex gap-1 text-yellow-500 mb-4">
                                    {[...Array(review.rating || 5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>

                                <p className="text-default-600 mb-5">
                                    "{review.comment}"
                                </p>

                                <div>
                                    <h4 className="font-bold">
                                        {review.patientName}
                                    </h4>

                                    <p className="text-sm text-default-400">
                                        Verified Patient
                                    </p>
                                </div>

                            </Card>
                        </motion.div>
                    ))}

                </div>

            </div>
        </section>
    );
}

