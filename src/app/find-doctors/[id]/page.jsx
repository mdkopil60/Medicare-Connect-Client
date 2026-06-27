'use client';

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaStar, FaRegClock, FaMoneyBillWave, FaHospital, FaUserMd, FaGraduationCap, FaNotesMedical } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { authClient } from '@/lib/auth-client'; // ✅ Better Auth

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function DoctorDetailsPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { id } = params;

    // ✅ Better Auth দিয়ে logged-in user নেওয়া হচ্ছে
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const currentUser = session?.user;

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({ symptoms: '', selectedDate: '', selectedSlot: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios.get(`http://localhost:5000/doctors/${id}`)
            .then(res => {
                setDoctor(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading || sessionLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading Premium Profile...</p>
        </div>
    );

    if (!doctor) return (
        <div className="text-center py-20 min-h-[60vh] flex flex-col justify-center items-center">
            <p className="text-red-500 font-bold text-2xl">Doctor Not Found!</p>
            <p className="text-gray-400 text-sm mt-2">The requested doctor profile could not be retrieved.</p>
        </div>
    );

    return (
        <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Side: Doctor Info */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                                <img
                                    src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.doctorName || 'Doctor'}&background=0d9488&color=fff`}
                                    alt={doctor.doctorName}
                                    className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-md"
                                />
                            </div>

                            <div className="flex-1 mt-2 sm:mt-0">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 uppercase tracking-wider">
                                    {doctor.specialization}
                                </span>
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3 tracking-tight">{doctor.doctorName}</h1>
                                <p className="text-gray-600 dark:text-gray-300 font-medium mt-2 flex items-center justify-center sm:justify-start gap-2">
                                    <FaGraduationCap className="text-slate-400 text-lg flex-shrink-0" />
                                    <span>{doctor.qualifications}</span>
                                </p>
                                <p className="text-sm text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
                                    <FaUserMd className="text-slate-400 flex-shrink-0" />
                                    <span>{doctor.experience} Years of Expert Experience</span>
                                </p>
                                <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 bg-amber-50/60 dark:bg-amber-950/20 w-fit px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                    <div className="flex items-center text-amber-500 gap-0.5">
                                        <FaStar /> <span className="font-bold ml-1 text-gray-900 dark:text-amber-400">{typeof doctor.averageRating === 'number' ? doctor.averageRating.toFixed(1) : doctor.averageRating || '0.0'}</span>
                                    </div>
                                    <span className="text-slate-300 dark:text-slate-700">|</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">{doctor.totalReviews || 0} Patient Reviews</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 my-8"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/80 dark:border-slate-800/60">
                                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                                    <FaHospital className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hospital / Chamber</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">{doctor.hospitalName || 'Not Specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/80 dark:border-slate-800/60">
                                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                    <FaMoneyBillWave className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Consultation Fee</p>
                                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-2xl mt-0.5">${doctor.consultationFee}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Booking */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2.5">
                            <span className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400"><FaRegClock className="text-sm" /></span>
                            <span>Book Appointment</span>
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Select Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition dark:text-white"
                                    required
                                    onChange={(e) => setBookingData({ ...bookingData, selectedDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Available Slots</label>
                                <select
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition dark:text-white"
                                    required
                                    onChange={(e) => setBookingData({ ...bookingData, selectedSlot: e.target.value })}
                                >
                                    <option value="">Choose an expert slot</option>
                                    {doctor.availableSlots?.map((slot, index) => (
                                        <option key={index} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Symptoms / Notes</label>
                                <textarea
                                    placeholder="Briefly describe your health condition..."
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition dark:text-white resize-none"
                                    rows="3"
                                    onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                                />
                            </div>

                            {bookingData.selectedDate && bookingData.selectedSlot ? (
                                <div className="mt-6 p-4 border border-dashed border-teal-200 dark:border-teal-900 rounded-xl bg-teal-50/30 dark:bg-teal-950/10">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2.5 flex items-center gap-1">
                                        <FaNotesMedical /> Secure Checkout via Stripe
                                    </label>
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm
                                            doctor={doctor}
                                            bookingData={bookingData}
                                            currentUser={currentUser} // ✅ real user পাঠানো হচ্ছে
                                            isSubmitting={isSubmitting}
                                            setIsSubmitting={setIsSubmitting}
                                        />
                                    </Elements>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-900 text-xs text-gray-400 font-medium">
                                    Please select a date and slot to unlock secure payment option.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckoutForm({ doctor, bookingData, currentUser, isSubmitting, setIsSubmitting }) {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        // ✅ Login check
        if (!currentUser?.email) {
            Swal.fire({
                title: 'Not Logged In!',
                text: 'Please login to book an appointment.',
                icon: 'warning',
                confirmButtonColor: '#0d9488'
            });
            return;
        }

        const card = elements.getElement(CardElement);
        if (card == null) return;

        setIsSubmitting(true);
        setCardError('');

        try {
            const token = localStorage.getItem('access-token');
            const headers = { headers: { authorization: `Bearer ${token}` } };

            // ১. Payment Intent তৈরি
            const res = await axios.post(
                'http://localhost:5000/create-payment-intent',
                { price: doctor.consultationFee },
                headers
            );
            const clientSecret = res.data.clientSecret;

            // ২. Card Payment Confirm
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: currentUser.email,
                        name: currentUser.name || currentUser.email,
                    },
                },
            });

            if (confirmError) {
                setCardError(confirmError.message);
                setIsSubmitting(false);
                return;
            }

            // ৩. Payment সফল হলে DB তে save
            if (paymentIntent.status === 'succeeded') {
                const appointmentInfo = {
                    // ✅ Patient এর সব তথ্য
                    patientId: currentUser.id,
                    patientEmail: currentUser.email,       // ✅ এটাই ছিল missing
                    patientName: currentUser.name || '',

                    // ✅ Doctor এর সব তথ্য
                    doctorId: doctor._id,
                    doctorEmail: doctor.email || '',
                    doctorName: doctor.doctorName || '',   // ✅ payment history তে দেখাবে
                    specialty: doctor.specialization || '', // ✅ payment history তে দেখাবে

                    // ✅ Appointment তথ্য
                    appointmentDate: bookingData.selectedDate,
                    appointmentTime: bookingData.selectedSlot,
                    appointmentStatus: 'pending',
                    symptoms: bookingData.symptoms,

                    // ✅ Payment তথ্য
                    paymentStatus: 'paid',
                    amount: doctor.consultationFee,
                    transactionId: paymentIntent.id,
                };

                const saveRes = await axios.post(
                    'http://localhost:5000/appointments',
                    appointmentInfo,
                    headers
                );

                if (saveRes.data.success) {
                    Swal.fire({
                        title: '🎉 Appointment Booked!',
                        html: `<p>Your appointment has been confirmed.</p><br/><small>Txn ID: <b>${paymentIntent.id}</b></small>`,
                        icon: 'success',
                        confirmButtonColor: '#0d9488'
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setCardError('Payment failed. Please try again.');
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '15px',
                                color: '#1e293b',
                                fontFamily: 'Inter, sans-serif',
                                '::placeholder': { color: '#94a3b8' },
                            },
                            invalid: { color: '#ef4444' },
                        },
                    }}
                />
            </div>
            {cardError && <p className="text-red-500 text-xs font-semibold">{cardError}</p>}
            <button
                type="submit"
                disabled={!stripe || isSubmitting}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-500/10 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 transition duration-200 transform active:scale-[0.99]"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </span>
                ) : `Authorize & Pay $${doctor.consultationFee}`}
            </button>
        </form>
    );
}