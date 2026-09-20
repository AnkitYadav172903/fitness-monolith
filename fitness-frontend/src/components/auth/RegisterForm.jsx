import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../../services/authService";
import { registerSchema } from "../../validation/registerSchema";
import FormInput from "../common/FormInput";
import PasswordStrength from "../common/PasswordStrength";
import SubmitButton from "../common/SubmitButton";
import AnimatedButton from "../common/AnimatedButton";

function RegisterForm() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password") || "";

    const nextStep = async () => {
        const valid = await trigger(["fullName", "email"]);
        if (valid) setStep(2);
    };

    const onSubmit = async (data) => {
        try {
            await registerUser({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            });

            toast.success("Account Created Successfully 🎉");

            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 surface border border-theme p-8 rounded-2xl w-full max-w-md"
        >
            <h2 className="text-3xl font-bold text-[color:var(--text)] text-center">
                Create Account
            </h2>

            <div>
                <div className="h-2 surface-secondary border border-theme rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-blue-600 transition-all duration-500 ${
                            step === 1 ? "w-1/2" : "w-full"
                        }`}
                    />
                </div>
                <p className="text-sm text-[color:var(--text-secondary)] text-center mt-2">
                    Step {step} of 2
                </p>
            </div>

            {step === 1 && (
                <>
                    <FormInput
                        label="Full Name"
                        name="fullName"
                        placeholder="Full Name"
                        register={register}
                        error={errors.fullName}
                    />

                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        register={register}
                        error={errors.email}
                    />

                    <AnimatedButton
                        type="button"
                        onClick={nextStep}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg"
                    >
                        Next
                    </AnimatedButton>
                </>
            )}

            {step === 2 && (
                <>
                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        error={errors.password}
                    />

                    <PasswordStrength password={password} />

                    <FormInput
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        register={register}
                        error={errors.confirmPassword}
                    />

                    <div className="flex gap-3">
                        <AnimatedButton
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 surface-secondary border border-theme text-[color:var(--text)] p-3 rounded-lg"
                        >
                            Back
                        </AnimatedButton>

                        <SubmitButton
                            loading={isSubmitting}
                            disabled={!isValid}
                            className="bg-green-600"
                        >
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </SubmitButton>
                    </div>
                </>
            )}

            <p className="text-center text-sm text-[color:var(--text-secondary)] pt-2">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-blue-400 hover:underline font-medium"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}

export default RegisterForm;