'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Input, TextArea, Spinner } from "@heroui/react";
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaStar, FaTimes, FaPen } from 'react-icons/fa';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);


    const [newReviewData, setNewReviewData] = useState({ doctorName: '', specialty: '', rating: 5, comment: '' });
    const [editFormData, setEditFormData] = useState({ doctorName: '', specialty: '', rating: 5, comment: '' });

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_URL}/reviews/my-reviews`, getAuthHeaders());
            setReviews(res.data || []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);
    const handleCreateReview = async (e) => {
        e.preventDefault();
        if (!newReviewData.doctorName || !newReviewData.comment) {
            Swal.fire('Warning', 'Please fill in the doctor name and comment.', 'warning');
            return;
        }

        try {
            await axios.post(`${API_URL}/reviews`, newReviewData, getAuthHeaders());
            Swal.fire('Success!', 'Your review has been published.', 'success');

            setNewReviewData({ doctorName: '', specialty: '', rating: 5, comment: '' });
            fetchReviews();
        } catch (err) {
            Swal.fire('Error', 'Failed to submit review.', 'error');
        }
    };

    const handleEditClick = (review) => {
        setSelectedReview(review);
        setEditFormData({
            doctorName: review.doctorName || '',
            specialty: review.specialty || '',
            rating: review.rating || 5,
            comment: review.comment || ''
        });
        setIsEditOpen(true);
    };

    const handleUpdateSave = async () => {
        try {
            await axios.put(`${API_URL}/reviews/${selectedReview._id}`, editFormData, getAuthHeaders());
            Swal.fire('Updated!', 'Review updated successfully.', 'success');
            setIsEditOpen(false);
            fetchReviews();
        } catch (err) {
            Swal.fire('Error', 'Failed to update review.', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_URL}/reviews/${id}`, getAuthHeaders());
                setReviews(reviews.filter(r => r._id !== id));
                Swal.fire('Deleted!', 'Your review has been deleted.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Failed to delete review.', 'error');
            }
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Spinner size="lg" color="secondary" /></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto min-h-screen flex flex-col gap-10">

            <Card className="p-6 border border-purple-100 shadow-md max-w-2xl bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 mb-4">
                    <FaPen className="text-purple-600" />
                    <h2 className="text-xl font-bold text-default-800">Write a Review</h2>
                </div>
                <form onSubmit={handleCreateReview} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Doctor Name"
                            placeholder="Dr. John Doe"
                            value={newReviewData.doctorName}
                            onChange={e => setNewReviewData({ ...newReviewData, doctorName: e.target.value })}
                            variant="bordered"
                        />
                        <Input
                            label="Specialty / Department"
                            placeholder="Cardiology"
                            value={newReviewData.specialty}
                            onChange={e => setNewReviewData({ ...newReviewData, specialty: e.target.value })}
                            variant="bordered"
                        />
                    </div>
                    <Input
                        label="Rating (1-5)"
                        type="number"
                        min={1}
                        max={5}
                        value={newReviewData.rating}
                        onChange={e => setNewReviewData({ ...newReviewData, rating: Number(e.target.value) })}
                        variant="bordered"
                    />
                    <TextArea
                        label="Your Comment"
                        placeholder="Share your experience with the doctor..."
                        value={newReviewData.comment}
                        onChange={e => setNewReviewData({ ...newReviewData, comment: e.target.value })}
                        variant="bordered"
                    />
                    <Button type="submit" color="secondary" className="font-bold text-white w-full md:w-max px-8">
                        Submit Review
                    </Button>
                </form>
            </Card>

            <hr className="border-slate-200" />

            <div>
                <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">My Reviews</h1>

                {reviews.length === 0 ? (
                    <div className="text-center p-10 border-2 border-dashed rounded-xl text-slate-400 font-medium">
                        No reviews found. Use the form above to add your first review!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviews.map(r => (
                            <Card key={r._id} className="p-5 flex flex-col gap-2 border border-purple-100 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-900">
                                <h3 className="font-bold text-lg text-default-800">{r.doctorName}</h3>
                                {r.specialty && <p className="text-xs font-semibold text-purple-600">{r.specialty}</p>}
                                <div className="flex text-amber-400 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < r.rating ? "text-amber-400" : "text-slate-300"} />
                                    ))}
                                </div>
                                <p className="text-sm italic my-2 text-default-600">"{r.comment}"</p>
                                <div className="flex gap-2 mt-auto pt-2">
                                    <Button size="sm" className="bg-indigo-50 text-indigo-600 font-bold" onClick={() => handleEditClick(r)}><FaEdit /> Edit</Button>
                                    <Button size="sm" color="danger" variant="flat" className="font-bold" onClick={() => handleDelete(r._id)}><FaTrash /> Delete</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />

                    <div className="bg-white dark:bg-zinc-900 max-w-md w-full p-6 rounded-2xl shadow-2xl border border-slate-100 z-10 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200">
                        <button className="absolute right-4 top-4 text-slate-400 hover:text-slate-600" onClick={() => setIsEditOpen(false)}>
                            <FaTimes />
                        </button>

                        <h2 className="text-xl font-bold border-b pb-2 text-default-800">Update Review</h2>

                        <div className="flex flex-col gap-4 py-2">
                            <Input
                                label="Doctor Name"
                                value={editFormData.doctorName}
                                onChange={e => setEditFormData({ ...editFormData, doctorName: e.target.value })}
                                variant="bordered"
                            />
                            <Input
                                label="Specialty"
                                value={editFormData.specialty}
                                onChange={e => setEditFormData({ ...editFormData, specialty: e.target.value })}
                                variant="bordered"
                            />
                            <Input
                                label="Rating"
                                type="number"
                                min={1}
                                max={5}
                                value={editFormData.rating}
                                onChange={e => setEditFormData({ ...editFormData, rating: Number(e.target.value) })}
                                variant="bordered"
                            />
                            <TextArea
                                label="Comment"
                                value={editFormData.comment}
                                onChange={e => setEditFormData({ ...editFormData, comment: e.target.value })}
                                variant="bordered"
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t pt-3">
                            <Button variant="light" size="sm" className="font-bold" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button color="success" size="sm" className="text-white font-bold" onClick={handleUpdateSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}