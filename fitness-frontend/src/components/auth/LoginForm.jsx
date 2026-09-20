import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../validation/loginSchema";
import FormInput from "../common/FormInput";
import SubmitButton from "../common/SubmitButton";

function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data) => {
        try {
            const response = await loginUser(data);

            login(response.user, response.token);

            toast.success("Login Successful 🎉");

            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Invalid email or password"
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 surface border border-theme p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
            <h2 className="text-3xl font-bold text-[color:var(--text)] text-center">
                Login to Fitness Monolith
            </h2>

            <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter Email"
                register={register}
                error={errors.email}
            />

            <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter Password"
                register={register}
                error={errors.password}
            />

            <SubmitButton loading={isSubmitting} disabled={!isValid}>
                {isSubmitting ? "Logging In..." : "Login"}
            </SubmitButton>
        </form>
    );
}

export default LoginForm;