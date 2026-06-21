"use client";

import React, { useState } from "react";
import { Card, Button, Chip, Input } from "@heroui/react";
import { Star, MessageSquare, Trash2, Edit2, PlusCircle, User, Sparkles, X } from "lucide-react";

const initialReviews = [
    {
        id: 1,
        doctor: "Dr. Nafis Iqbal",
        specialty: "Cardiologist",
        date: "2026-06-18",
        rating: 5,
        comment: "Excellent experience! He explained everything very clearly and was very reassuring.",
    },
    {
        id: 2,
        doctor: "Dr. Sarah Rahman",
        specialty: "Dermatologist",
        date: "2026-06-12",
        rating: 4,
        comment: "Very professional doctor. The prescription worked well, though the waiting time was slightly long.",
    },
];

export default function MyReviewsPage() {
    const [reviews, setReviews] = useState(initialReviews);
    const [isOpen, setIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");

    // ফর্ম স্টেটসমূহ
    const [selectedId, setSelectedId] = useState(null);
    const [doctor, setDoctor] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedId(null);
        setDoctor("");
        setSpecialty("");
        setRating(5);
        setComment("");
        setIsOpen(true);
    };

    const handleEditClick = (review) => {
        setModalMode("edit");
        setSelectedId(review.id);
        setDoctor(review.doctor);
        setSpecialty(review.specialty);
        setRating(review.rating);
        setComment(review.comment);
        setIsOpen(true);
    };

    const handleSaveReview = () => {
        if (!doctor || !comment) {
            alert("Please fill in the Doctor Name and Comment.");
            return;
        }

        if (modalMode === "add") {
            const newReview = {
                id: Date.now(),
                doctor,
                specialty: specialty || "General Physician",
                date: new Date().toISOString().split("T")[0],
                rating: Number(rating),
                comment,
            };
            setReviews([newReview, ...reviews]);
        } else {
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === selectedId
                        ? { ...r, doctor, specialty, rating: Number(rating), comment }
                        : r
                )
            );
        }
        setIsOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this review?")) {
            setReviews((prev) => prev.filter((r) => r.id !== id));
        }
    };

    return (
        <div className="container mx-auto max-w-6xl p-6 min-h-screen bg-slate-50/40 dark:bg-zinc-950">
            {/* হেডার সেকশন */}
            <div className="mb-10 border-b border-default-200/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
                        My Reviews
                    </h1>
                    <p className="text-default-500 text-sm mt-1">
                        Share your feedback, update previous feedback, and view your experience logs.
                    </p>
                </div>

                <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold h-11 px-5 rounded-xl shadow-lg shadow-purple-500/20 transition-transform active:scale-95"
                    startContent={<PlusCircle className="w-4 h-4" />}
                    onPress={handleAddClick}
                >
                    Write A Review
                </Button>
            </div>

            {reviews.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-purple-200 bg-purple-50/10">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <MessageSquare className="w-12 h-12 text-purple-400" />
                        <p className="text-lg font-semibold text-default-700">No reviews found.</p>
                    </div>
                </Card>
            ) : (
                /* রিভিও গ্রিড */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <Card
                            key={review.id}
                            className="group relative border border-purple-100/60 dark:border-purple-950/50 hover:border-purple-400/50 bg-gradient-to-b from-purple-50/10 via-background to-background transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start gap-3 mb-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-100/70 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/50 flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105 duration-300">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-md font-bold tracking-tight text-default-800 leading-snug">
                                                {review.doctor}
                                            </h3>
                                            <p className="text-xs font-semibold text-purple-600 mt-0.5">
                                                {review.specialty}
                                            </p>
                                        </div>
                                    </div>

                                    <Chip
                                        variant="flat"
                                        color="secondary"
                                        size="sm"
                                        startContent={<Star className="w-3 h-3 text-purple-600 fill-purple-600 mx-1" />}
                                        className="font-bold px-2 rounded-full border-none bg-purple-100/50 text-purple-700"
                                    >
                                        {review.rating}.0
                                    </Chip>
                                </div>

                                <div className="p-4 rounded-2xl bg-purple-50/30 dark:bg-purple-950/10 border border-purple-100/30 flex flex-col gap-2">
                                    <div className="flex gap-0.5 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-default-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-default-700 font-medium italic leading-relaxed line-clamp-3">
                                        "{review.comment}"
                                    </p>
                                    <span className="text-[10px] text-default-400 mt-2 block font-semibold">
                                        Reviewed on: {review.date}
                                    </span>
                                </div>
                            </div>

                            <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                                <Button
                                    className="flex-1 font-bold text-xs h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                    variant="flat"
                                    startContent={<Edit2 className="w-3.5 h-3.5" />}
                                    onPress={() => handleEditClick(review)}
                                >
                                    Update
                                </Button>
                                <Button
                                    className="font-bold text-xs h-11 rounded-xl border border-danger-100 dark:border-danger-950/50 hover:bg-danger/10 text-danger"
                                    variant="light"
                                    startContent={<Trash2 className="w-3.5 h-3.5" />}
                                    onPress={() => handleDelete(review.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* ─── ১০০% এরর-ফ্রি পারফেক্ট সেন্টারেড কাস্টম মোডাল ইন্টারফেস ─── */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* ব্যাকড্রপ ব্লার লেয়ার (বাইরে ক্লিক করলে মোডাল বন্ধ হবে) */}
                    <div
                        className="fixed inset-0 bg-zinc-950/50 backdrop-blur-md cursor-pointer"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* মোডাল কন্টেন্ট বক্স (পারফেক্ট সেন্টার লকড) */}
                    <div className="relative bg-white dark:bg-zinc-900 max-w-md w-full p-6 rounded-[28px] shadow-2xl border border-default-200/60 flex flex-col gap-5 z-10 animate-in zoom-in-95 duration-200 overflow-hidden">

                        {/* টপ প্রিমিয়াম কালার গ্রেডিয়েন্ট স্ট্রিপ */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

                        {/* '×' ক্লোজ বাটন */}
                        <button
                            type="button"
                            className="absolute right-4 top-4 text-default-400 hover:text-default-700 p-1.5 rounded-xl hover:bg-default-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* হেডার পার্ট */}
                        <div className="pb-2 border-b border-default-100 flex items-center gap-2 mt-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <h2 className="text-xl font-bold text-default-800 dark:text-zinc-100 tracking-tight">
                                {modalMode === "add" ? "Write a Review" : "Modify Review"}
                            </h2>
                        </div>

                        {/* বডি পার্ট (ইনপুট ফিল্ডস) */}
                        <div className="flex flex-col gap-5 py-1">
                            <Input
                                type="text"
                                label="Doctor's Name"
                                placeholder="Dr. Nafis Iqbal"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="xl"
                                size="lg"
                                className="font-medium"
                                value={doctor}
                                onChange={(e) => setDoctor(e.target.value)}
                            />

                            <Input
                                type="text"
                                label="Specialty / Department"
                                placeholder="e.g. Cardiologist"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="xl"
                                size="lg"
                                className="font-medium"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-default-700 dark:text-zinc-300">Rating Experience</label>
                                <div className="flex items-center justify-between bg-purple-50/40 dark:bg-purple-950/10 p-3 rounded-2xl border border-purple-100/40">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setRating(num)}
                                                className="focus:outline-none transition-transform active:scale-75 hover:scale-110 duration-150"
                                            >
                                                <Star className={`w-7 h-7 ${num <= rating ? "text-amber-400 fill-amber-400 filter drop-shadow-sm" : "text-default-300"}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-purple-600 bg-purple-100/60 px-2.5 py-1 rounded-lg">
                                        {rating} Star{rating > 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>

                            <Input
                                type="text"
                                label="Your Medical Experience"
                                placeholder="Share specific details about the doctor..."
                                labelPlacement="outside"
                                variant="bordered"
                                radius="xl"
                                size="lg"
                                className="font-medium"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        {/* ফুটার পার্ট (HTML স্ট্যান্ডার্ড বাটন যা কনসোল এরর দিবে না) */}
                        <div className="flex justify-end gap-3 pt-3 border-t border-default-100">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl text-sm font-bold text-default-500 hover:bg-default-100 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-500/20 hover:opacity-95 transition-opacity"
                                onClick={handleSaveReview}
                            >
                                {modalMode === "add" ? "Submit Feedback" : "Save Changes"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}