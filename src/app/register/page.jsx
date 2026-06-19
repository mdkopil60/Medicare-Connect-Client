"use client";

import { useState } from "react";
import { Card, Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/Icons"; // আপনার আইকন ফাইল

export default function RegisterPage() {
    const [role, setRole] = useState("Patient");
    const [gender, setGender] = useState("male");
    const [specialization, setSpecialization] = useState("cardiology");

    // পাসওয়ার্ড হাইড/শো করার জন্য রিয়্যাক্ট স্টেট
    const [isPassVisible, setIsPassVisible] = useState(false);
    const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);

    // স্টেট পরিবর্তনের ক্লিক হ্যান্ডলার
    const togglePassVisibility = (e) => {
        e.preventDefault();
        setIsPassVisible(!isPassVisible);
    };

    const toggleConfirmPassVisibility = (e) => {
        e.preventDefault();
        setIsConfirmPassVisible(!isConfirmPassVisible);
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password", "");
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

    const onSubmit = (data) => {
        const finalData = {
            ...data,
            role,
            gender,
            ...(role === "Doctor" && { specialization })
        };
        console.log("Final Registration Data:", finalData);
        toast.success("Registration Successful!");
    };

    const inputClassNames = {
        inputWrapper: "bg-[#f8fafc] border border-slate-200/60 px-5 hover:bg-[#f1f5f9] focus-within:!bg-white focus-within:!border-[#009b90] transition-all h-[52px]",
        input: "text-slate-800 placeholder:text-slate-400 text-[14px]"
    };

    const nativeSelectClass = "w-full h-[52px] px-5 pr-10 rounded-full bg-[#f8fafc] border border-slate-200/60 text-slate-500 text-[14px] outline-none hover:bg-[#f1f5f9] focus:bg-white focus:border-[#009b90] transition-all appearance-none cursor-pointer";

    return (
        <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center px-4 py-12">
            <Toaster position="top-right" />

            <Card className="w-full max-w-xl p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100 bg-white rounded-[26px]">

                {/* Header Title */}
                <div className="flex flex-col gap-1 items-center justify-center pb-8 text-center">
                    <h2 className="text-[26px] font-bold text-[#0f2942] tracking-tight">Create Account</h2>
                    <p className="text-sm text-slate-400 font-medium">
                        Join <span className="text-[#009b90] font-semibold">MediCare Connect</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            type="text"
                            placeholder="Full Name"
                            variant="flat"
                            radius="full"
                            classNames={inputClassNames}
                            isInvalid={!!errors.name}
                            errorMessage={errors.name?.message}
                            {...register("name", { required: "Name is required" })}
                        />

                        <Input
                            type="email"
                            placeholder="Email Address"
                            variant="flat"
                            radius="full"
                            classNames={inputClassNames}
                            isInvalid={!!errors.email}
                            errorMessage={errors.email?.message}
                            {...register("email", { required: "Email is required" })}
                        />
                    </div>

                    {/* Photo URL */}
                    <Input
                        type="url"
                        placeholder="Photo URL"
                        variant="flat"
                        radius="full"
                        classNames={inputClassNames}
                        isInvalid={!!errors.photo}
                        errorMessage={errors.photo?.message}
                        {...register("photo", { required: "Photo URL is required" })}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            placeholder="Password"
                            variant="flat"
                            radius="full"
                            classNames={inputClassNames}
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                            type={isPassVisible ? "text" : "password"}
                            endContent={
                                <button
                                    className="focus:outline-none pr-1 pointer-events-auto cursor-pointer text-slate-400 hover:text-[#009b90] transition-colors"
                                    type="button"
                                    onClick={togglePassVisibility}
                                >
                                    {isPassVisible ? <EyeSlashFilledIcon className="text-xl" /> : <EyeFilledIcon className="text-xl" />}
                                </button>
                            }
                            {...register("password", {
                                required: "Password is required",
                                pattern: {
                                    value: passwordRegex,
                                    message: "Must be 6+ chars with 1 number & 1 special char"
                                }
                            })}
                        />

                        <Input
                            placeholder="Confirm Password"
                            variant="flat"
                            radius="full"
                            classNames={inputClassNames}
                            isInvalid={!!errors.confirmPassword}
                            errorMessage={errors.confirmPassword?.message}
                            type={isConfirmPassVisible ? "text" : "password"}
                            endContent={
                                <button
                                    className="focus:outline-none pr-1 pointer-events-auto cursor-pointer text-slate-400 hover:text-[#009b90] transition-colors"
                                    type="button"
                                    onClick={toggleConfirmPassVisibility}
                                >
                                    {isConfirmPassVisible ? <EyeSlashFilledIcon className="text-xl" /> : <EyeFilledIcon className="text-xl" />}
                                </button>
                            }
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) => value === password || "Passwords do not match"
                            })}
                        />
                    </div>

                    {/* Phone & Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            type="text"
                            placeholder="Phone (+8801XXXXXXXXX)"
                            variant="flat"
                            radius="full"
                            classNames={inputClassNames}
                            isInvalid={!!errors.phone}
                            errorMessage={errors.phone?.message}
                            {...register("phone", { required: "Phone number is required" })}
                        />

                        <div className="relative">
                            <select
                                className={nativeSelectClass}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                        </div>
                    </div>

                    {/* Register As Dropdown */}
                    <div className="relative">
                        <select
                            className={nativeSelectClass}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                    </div>

                    {/* Doctor Info Section */}
                    {role === "Doctor" && (
                        <div className="bg-[#f8fafc]/60 p-6 rounded-[22px] border border-slate-200/50 space-y-4 !mt-5 transition-all">
                            <h3 className="font-bold text-[14px] text-[#0f2942] px-1">Doctor Professional Details</h3>

                            <div className="relative">
                                <select
                                    className="w-full h-[52px] px-5 pr-10 rounded-full bg-white border border-slate-200/60 text-slate-500 text-[14px] outline-none focus:border-[#009b90] transition-all appearance-none cursor-pointer"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                >
                                    <option value="cardiology">Cardiology</option>
                                    <option value="neurology">Neurology</option>
                                    <option value="orthopedic">Orthopedic</option>
                                    <option value="dermatology">Dermatology</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                            </div>

                            <Input
                                placeholder="Qualifications (e.g. MBBS, FCPS)"
                                variant="flat"
                                radius="full"
                                classNames={{ inputWrapper: "bg-white border border-slate-200/60 h-[52px]" }}
                                isInvalid={!!errors.qualification}
                                errorMessage={errors.qualification?.message}
                                {...register("qualification", { required: "Required" })}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    placeholder="Experience (Years)"
                                    variant="flat"
                                    radius="full"
                                    classNames={{ inputWrapper: "bg-white border border-slate-200/60 h-[52px]" }}
                                    isInvalid={!!errors.experience}
                                    errorMessage={errors.experience?.message}
                                    {...register("experience", { required: "Required" })}
                                />

                                <Input
                                    type="number"
                                    placeholder="Consultation Fee ($)"
                                    variant="flat"
                                    radius="full"
                                    classNames={{ inputWrapper: "bg-white border border-slate-200/60 h-[52px]" }}
                                    isInvalid={!!errors.fee}
                                    errorMessage={errors.fee?.message}
                                    {...register("fee", { required: "Required" })}
                                />
                            </div>

                            <Input
                                placeholder="Hospital Name"
                                variant="flat"
                                radius="full"
                                classNames={{ inputWrapper: "bg-white border border-slate-200/60 h-[52px]" }}
                                isInvalid={!!errors.hospital}
                                errorMessage={errors.hospital?.message}
                                {...register("hospital", { required: "Required" })}
                            />
                        </div>
                    )}

                    {/* Register Button */}
                    <Button
                        type="submit"
                        radius="full"
                        size="lg"
                        className="bg-[#009b90] hover:bg-[#00867d] text-white font-semibold text-[16px] h-[54px] shadow-sm !mt-6 w-full transition-all"
                    >
                        Register
                    </Button>

                    {/* Footer Redirect */}
                    <div className="text-center pt-3">
                        <p className="text-[14px] text-slate-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#009b90] hover:underline font-semibold ml-1">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </Card>
        </div>
    );
}