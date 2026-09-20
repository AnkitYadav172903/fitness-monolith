import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { createActivity } from "../../services/activityService";
import { activitySchema } from "../../validation/activitySchema";
import FormInput from "../common/FormInput";
import SubmitButton from "../common/SubmitButton";

const defaultValues = {
    activityType: "RUNNING",
    caloriesBurned: "",
    durationMinutes: "",
    activityDate: "",
};

export default function ActivityForm({ refresh, closeModal }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(activitySchema),
        defaultValues,
    });

    const onSubmit = async (data) => {
        try {
            await createActivity(data);
            toast.success("Activity Added");

            refresh();
            closeModal();
        } catch {
            toast.error("Something went wrong.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm text-[color:var(--text-secondary)]">
                    Activity Type
                </label>

                <select
                    {...register("activityType")}
                    className="w-full surface-secondary border border-theme text-[color:var(--text)] p-3 rounded-xl outline-none"
                >
                    <option>RUNNING</option>
                    <option>CYCLING</option>
                    <option>WALKING</option>
                    <option>YOGA</option>
                    <option>GYM</option>
                </select>
            </div>

            <FormInput
                label="Calories Burned"
                name="caloriesBurned"
                type="number"
                placeholder="Calories Burned"
                register={register}
                error={errors.caloriesBurned}
            />

            <FormInput
                label="Workout Minutes"
                name="durationMinutes"
                type="number"
                placeholder="Workout Minutes"
                register={register}
                error={errors.durationMinutes}
            />

            <FormInput
                label="Date"
                name="activityDate"
                type="date"
                register={register}
                error={errors.activityDate}
            />

            <SubmitButton loading={isSubmitting}>
                Add Activity
            </SubmitButton>
        </form>
    );
}