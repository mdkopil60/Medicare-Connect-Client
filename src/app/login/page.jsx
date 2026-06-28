"use client";

import { useState } from "react";
import { Input, Button, Card } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/Icons";
import { signIn, authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const toggleVisibility = () => setIsVisible((prev) => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const tempErrors = {};
        if (!formData.email) tempErrors.email = "Email is required";
        if (!formData.password) tempErrors.password = "Password is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const result = await signIn.email({
                email: formData.email,
                password: formData.password,
            });
            if (result?.error) {
                toast.error(result.error.message || "Login failed");
                return;
            }
            toast.success("Logged in successfully!");
            router.push("/");
            router.refresh();
        } catch {
            toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch {
            toast.error("Google sign-in failed. Please try again.");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9] px-4 py-12">
            <Card className="max-w-md w-full p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100 bg-white rounded-[26px]">

                <div className="flex flex-col gap-1 items-center pb-6 text-center">
                    <h2 className="text-[26px] font-bold text-[#0f2942] tracking-tight">
                        Welcome back
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">
                        Access your healthcare portal
                    </p>
                </div>

                <Button
                    variant="flat"
                    radius="full"
                    size="lg"
                    className="w-full font-medium bg-[#f8fafc] border border-slate-200/60 text-slate-700 hover:bg-[#f1f5f9] h-[52px] text-[15px]"
                    startContent={<FcGoogle className="text-xl" />}
                    onPress={handleGoogleLogin}
                    isLoading={googleLoading}
                    isDisabled={loading}
                >
                    Continue with Google
                </Button>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-slate-200/60" />
                    <span className="text-[12px] font-semibold text-slate-400 px-3 tracking-wider">
                        OR
                    </span>
                    <div className="flex-1 border-t border-slate-200/60" />
                </div>

                <form onSubmit={handleEmailLogin} className="flex flex-col gap-4" noValidate>
                    <Input
                        type="email"
                        placeholder="Email address"
                        name="email"
                        variant="flat"
                        radius="full"
                        size="lg"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email}
                        classNames={{
                            inputWrapper:
                                "bg-[#f8fafc] border border-slate-200/60 px-5 hover:bg-[#f1f5f9] focus-within:!bg-white focus-within:!border-[#009b90] transition-all h-[52px]",
                            input: "text-slate-800 placeholder:text-slate-400 text-[14px]",
                        }}
                    />

                    <Input
                        placeholder="Password"
                        name="password"
                        variant="flat"
                        radius="full"
                        size="lg"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        type={isVisible ? "text" : "password"}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password}
                        classNames={{
                            inputWrapper:
                                "bg-[#f8fafc] border border-slate-200/60 px-5 hover:bg-[#f1f5f9] focus-within:!bg-white focus-within:!border-[#009b90] transition-all h-[52px]",
                            input: "text-slate-800 placeholder:text-slate-400 text-[14px]",
                        }}
                        endContent={
                            <button
                                type="button"
                                onClick={toggleVisibility}
                                aria-label={isVisible ? "Hide password" : "Show password"}
                                className="focus:outline-none pr-1 cursor-pointer text-slate-400 hover:text-[#009b90] transition-colors"
                            >
                                {isVisible
                                    ? <EyeSlashFilledIcon className="text-xl" />
                                    : <EyeFilledIcon className="text-xl" />
                                }
                            </button>
                        }
                    />

                    <Button
                        type="submit"
                        radius="full"
                        size="lg"
                        isLoading={loading}
                        isDisabled={googleLoading}
                        className="bg-[#009b90] hover:bg-[#00867d] text-white font-semibold text-[16px] h-[54px] shadow-sm mt-4 w-full"
                    >
                        Sign in
                    </Button>
                </form>

                <p className="text-center text-[14px] text-slate-500 font-medium mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-[#009b90] hover:underline font-semibold"
                    >
                        Register here
                    </Link>
                </p>

            </Card>
        </div>
    );
}