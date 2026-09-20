import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

import { updatePassword } from "../../services/profileService";
import { passwordSchema } from "../../validation/passwordSchema";
import FormInput from "../common/FormInput";
import PasswordStrength from "../common/PasswordStrength";
import SubmitButton from "../common/SubmitButton";

export default function SecuritySettings() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirm: "",
        },
    });

    const newPassword = watch("newPassword") || "";

    const onSubmit = async (data) => {
        try {
            await updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            toast.success("Password Updated");

            reset({
                currentPassword: "",
                newPassword: "",
                confirm: "",
            });
        } catch {
            toast.error("Wrong Current Password");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="surface border border-theme rounded-2xl p-6 space-y-5"
        >
            <div className="flex items-center gap-3">
                <Lock className="text-blue-400" />

                <h2 className="text-[color:var(--text)] text-xl font-bold">
                    Change Password
                </h2>
            </div>

            <FormInput
                label="Current Password"
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                register={register}
                error={errors.currentPassword}
            />

            <FormInput
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="New Password"
                register={register}
                error={errors.newPassword}
            />

            <PasswordStrength password={newPassword} />

            <FormInput
                label="Confirm New Password"
                name="confirm"
                type="password"
                placeholder="Confirm New Password"
                register={register}
                error={errors.confirm}
            />

            <SubmitButton loading={isSubmitting} disabled={!isValid}>
                Update Password
            </SubmitButton>
        </form>
    );
}