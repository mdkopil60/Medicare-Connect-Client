"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Card, Input, Button } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/Icons";
import { signIn, signUp } from "@/lib/auth-client";

export default function RegisterPage() {
    const [role, setRole] = useState("Patient");
    const [gender, setGender] = useState("male");
    const [specialization, setSpecialization] = useState("cardiology");
    const [loading, setLoading] = useState(false);

    const [isPassVisible, setIsPassVisible] = useState(false);
    const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const password = watch("password", "");

    const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

    const onSubmit = async (data) => {
        try {
            setLoading(true);


            const result = await signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                image: data.photo,
            });

            if (result?.error) {
                toast.error(result.error.message);
                return;
            }

            const user = result?.data?.user;

            await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?.id,
                    role,
                    gender,
                    phone: data.phone,
                    photo: data.photo,

                    ...(role === "Doctor" && {
                        specialization,
                        qualification: data.qualification,
                        experience: Number(data.experience),
                        fee: Number(data.fee),
                        hospital: data.hospital,
                    }),
                }),
            });
            console.log(data);

            toast.success("Registration Successful!");
            reset();
        } catch (error) {
            console.error(error);
            toast.error("Registration Failed");
        } finally {
            setLoading(false);
        }


    };

    const inputClassNames = {
        inputWrapper:
            "bg-[#f8fafc] border border-slate-200 px-5 hover:bg-[#f1f5f9] focus-within:!bg-white focus-within:!border-[#009b90] transition-all h-[52px]",
        input:
            "text-slate-800 placeholder:text-slate-400 text-[14px]",
    };
    const selectClass =
        "w-full h-[52px] px-5 pr-10 rounded-full bg-[#f8fafc] border border-slate-200 text-slate-500 text-[14px] outline-none focus:border-[#009b90] appearance-none";

    return (<div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center px-4 py-10"> <Toaster position="top-right" />
        <Card className="w-full max-w-2xl p-8 rounded-3xl shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">
                    Create Account
                </h1>

                <p className="text-slate-500 mt-2">
                    Join MediCare Connect
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Full Name"
                        radius="full"
                        classNames={inputClassNames}
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                        {...register("name", {
                            required: "Name is required",
                        })}
                    />

                    <Input
                        type="email"
                        placeholder="Email"
                        radius="full"
                        classNames={inputClassNames}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                </div>

                <Input
                    type="url"
                    placeholder="Photo URL"
                    radius="full"
                    classNames={inputClassNames}
                    isInvalid={!!errors.photo}
                    errorMessage={errors.photo?.message}
                    {...register("photo", {
                        required: "Photo URL is required",
                    })}
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Password"
                        radius="full"
                        type={isPassVisible ? "text" : "password"}
                        classNames={inputClassNames}
                        endContent={
                            <button
                                type="button"
                                onClick={() =>
                                    setIsPassVisible(!isPassVisible)
                                }
                            >
                                {isPassVisible ? (
                                    <EyeSlashFilledIcon />
                                ) : (
                                    <EyeFilledIcon />
                                )}
                            </button>
                        }
                        isInvalid={!!errors.password}
                        errorMessage={errors.password?.message}
                        {...register("password", {
                            required: "Password required",
                            pattern: {
                                value: passwordRegex,
                                message:
                                    "6+ chars, number & special character required",
                            },
                        })}
                    />

                    <Input
                        placeholder="Confirm Password"
                        radius="full"
                        type={
                            isConfirmPassVisible
                                ? "text"
                                : "password"
                        }
                        classNames={inputClassNames}
                        endContent={
                            <button
                                type="button"
                                onClick={() =>
                                    setIsConfirmPassVisible(
                                        !isConfirmPassVisible
                                    )
                                }
                            >
                                {isConfirmPassVisible ? (
                                    <EyeSlashFilledIcon />
                                ) : (
                                    <EyeFilledIcon />
                                )}
                            </button>
                        }
                        isInvalid={!!errors.confirmPassword}
                        errorMessage={
                            errors.confirmPassword?.message
                        }
                        {...register("confirmPassword", {
                            required: "Confirm password",
                            validate: (value) =>
                                value === password ||
                                "Passwords do not match",
                        })}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Phone Number"
                        radius="full"
                        classNames={inputClassNames}
                        {...register("phone", {
                            required: "Phone required",
                        })}
                    />

                    <select
                        className={selectClass}
                        value={gender}
                        onChange={(e) =>
                            setGender(e.target.value)
                        }
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <select
                    className={selectClass}
                    value={role}
                    onChange={(e) =>
                        setRole(e.target.value)
                    }
                >
                    <option value="Patient">
                        Patient
                    </option>
                    <option value="Doctor">
                        Doctor
                    </option>
                </select>

                {role === "Doctor" && (
                    <div className="border rounded-3xl p-5 space-y-4">
                        <h3 className="font-semibold">
                            Doctor Information
                        </h3>

                        <select
                            className={selectClass}
                            value={specialization}
                            onChange={(e) =>
                                setSpecialization(
                                    e.target.value
                                )
                            }
                        >
                            <option value="cardiology">
                                Cardiology
                            </option>
                            <option value="neurology">
                                Neurology
                            </option>
                            <option value="orthopedic">
                                Orthopedic
                            </option>
                            <option value="dermatology">
                                Dermatology
                            </option>
                        </select>

                        <Input
                            placeholder="Qualification"
                            radius="full"
                            {...register(
                                "qualification"
                            )}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                type="number"
                                placeholder="Experience"
                                radius="full"
                                {...register(
                                    "experience"
                                )}
                            />

                            <Input
                                type="number"
                                placeholder="Consultation Fee"
                                radius="full"
                                {...register("fee")}
                            />
                        </div>

                        <Input
                            placeholder="Hospital Name"
                            radius="full"
                            {...register("hospital")}
                        />
                    </div>
                )}

                <Button
                    type="submit"
                    radius="full"
                    className="w-full bg-[#009b90] text-white h-14"
                    isLoading={loading}
                >
                    Register
                </Button>

                <p className="text-center text-sm">
                    Already have an account?
                    <Link
                        href="/login"
                        className="ml-2 text-[#009b90] font-semibold"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </Card>
    </div>


    );
}
