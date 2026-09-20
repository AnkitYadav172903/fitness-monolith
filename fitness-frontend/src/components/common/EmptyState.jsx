import { Inbox } from "lucide-react";

export default function EmptyState({
                                        title,
                                        subtitle,
                                    }) {
    return (
        <div className="surface border border-theme rounded-3xl py-20 text-center">
            <Inbox
                size={70}
                className="mx-auto text-slate-500"
            />

            <h2 className="text-[color:var(--text)] text-2xl font-bold mt-6">
                {title}
            </h2>

            <p className="text-[color:var(--text-secondary)] mt-3">
                {subtitle}
            </p>
        </div>
    );
}