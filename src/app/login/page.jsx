'use client';

import React, { useState } from 'react';
import { Input, Button, Card } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Icons';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    // আইকন ক্লিকের ইভেন্টকে বাটন ট্র্যাপ থেকে মুক্ত করার জন্য ফিক্সড লজিক
    const toggleVisibility = (e) => {
        e.preventDefault();
        setIsVisible(!isVisible);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = 'Email is required';
        if (!formData.password) tempErrors.password = 'Password is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // API / Auth Integration এবং JWT জেনারেশন লজিক এখানে হবে
            toast.success('Welcome Back!');
            router.push('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Invalid Email or Password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            // Google Auth Logic
            toast.success('Google Login Successful!');
            router.push('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Google Authentication Failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9] px-4 py-12">
            <Card className="max-w-md w-full p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100 bg-white rounded-[26px]">

                {/* Header Section */}
                <div className="flex flex-col gap-1 items-center justify-center pb-6 text-center">
                    <h2 className="text-[26px] font-bold text-[#0f2942] tracking-tight">Welcome Back</h2>
                    <p className="text-sm text-slate-400 font-medium">Access your healthcare portal</p>
                </div>

                {/* Body Section */}
                <div className="mt-2">
                    {/* Google Sign-in Button */}
                    <Button
                        variant="flat"
                        radius="full"
                        size="lg"
                        className="w-full font-medium bg-[#f8fafc] border border-slate-200/60 text-slate-700 hover:bg-[#f1f5f9] h-[52px] text-[15px] transition-all"
                        startContent={<FcGoogle className="text-xl" />}
                        onClick={handleGoogleLogin}
                        isLoading={googleLoading}
                    >
                        Continue with Google
                    </Button>

                    {/* Custom Aesthetic Divider */}
                    <div className="flex items-center my-6 w-full">
                        <div className="flex-1 border-t border-slate-200/60"></div>
                        <span className="text-[12px] font-semibold text-slate-400 px-3 tracking-wider">OR</span>
                        <div className="flex-1 border-t border-slate-200/60"></div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
                        <Input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            variant="flat"
                            radius="full"
                            size="lg"
                            classNames={{
                                inputWrapper: "bg-[#f8fafc] border border-slate-200/60 px-5 hover:bg-[#f1f5f9] focus-within:!bg-white focus-within:!border-[#009b90] transition-all h-[52px]",
                                input: "text-slate-800 placeholder:text-slate-400 text-[14px]"
                            }}
                            color={errors.email ? 'danger' : 'default'}
                            errorMessage={errors.email}
                            isInvalid={!!errors.email}
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            placeholder="Password"
                            name="password"
                            variant="flat"
                            radius="full"
                            size="lg"
                            classNames={{
                                inputWrapper: "bg-[#f8fafc] border border-slate-200/60 px-5 hover:bg-[#f1f5f9] focus-within:!bg-white focus-within:!border-[#009b90] transition-all h-[52px]",
                                input: "text-slate-800 placeholder:text-slate-400 text-[14px]"
                            }}
                            color={errors.password ? 'danger' : 'default'}
                            errorMessage={errors.password}
                            isInvalid={!!errors.password}
                            value={formData.password}
                            onChange={handleChange}
                            endContent={
                                <button
                                    className="focus:outline-none pr-1 pointer-events-auto cursor-pointer text-slate-400 hover:text-[#009b90] transition-colors"
                                    type="button"
                                    onClick={toggleVisibility}
                                >
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-xl" />
                                    ) : (
                                        <EyeFilledIcon className="text-xl" />
                                    )}
                                </button>
                            }
                            type={isVisible ? 'text' : 'password'}
                        />

                        <Button
                            type="submit"
                            radius="full"
                            size="lg"
                            className="bg-[#009b90] hover:bg-[#00867d] text-white font-semibold text-[16px] h-[54px] shadow-sm mt-4 w-full transition-all"
                            isLoading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Redirect Link */}
                    <div className="text-center mt-6">
                        <p className="text-[14px] text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-[#009b90] hover:underline font-semibold ml-1">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}