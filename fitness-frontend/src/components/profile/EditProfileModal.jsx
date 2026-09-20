import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { updateProfile } from "../../services/profileService";
import { profileSchema } from "../../validation/profileSchema";
import FormInput from "../common/FormInput";
import SubmitButton from "../common/SubmitButton";

export default function EditProfileModal({ user, onSave }) {
    const [saving, setSaving] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            fullName: user?.fullName || user?.name || "",
            email: user?.email || "",
            height: user?.height || 170,
            weight: user?.weight || 70,
            bio: user?.bio || "",
        },
    });

    const bio = watch("bio") || "";

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    const onSubmit = async (data) => {
        try {
            setSaving(true);

            const updated = await updateProfile(data);

            toast.success("Profile Updated");

            onSave(updated);
        } catch {
            toast.error("Update Failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    label="Height (cm)"
                    name="height"
                    type="number"
                    placeholder="Height"
                    register={register}
                    error={errors.height}
                />

                <FormInput
                    label="Weight (kg)"
                    name="weight"
                    type="number"
                    placeholder="Weight"
                    register={register}
                    error={errors.weight}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-[color:var(--text-secondary)]">
                    Bio
                </label>

                <textarea
                    {...register("bio")}
                    rows={3}
                    maxLength={150}
                    placeholder="Tell us about your fitness journey..."
                    className={`w-full rounded-xl p-3 surface-secondary border text-[color:var(--text)] outline-none transition focus:border-blue-500 ${
                        errors.bio ? "border-red-500" : "border-theme"
                    }`}
                />

                <p className="text-right text-sm text-[color:var(--text-secondary)]">
                    {bio.length}/150
                </p>

                {errors.bio && (
                    <p className="text-red-400 text-sm">{errors.bio.message}</p>
                )}
            </div>

            <SubmitButton
                loading={saving}
                disabled={!isValid}
                className="bg-green-600"
            >
                {saving ? "Saving..." : "Save Changes"}
            </SubmitButton>
        </form>
    );
}