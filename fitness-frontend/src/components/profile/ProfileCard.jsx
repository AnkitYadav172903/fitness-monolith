import { Mail, Calendar } from "lucide-react";
import LazyImage from "../common/LazyImage";

export default function ProfileCard({ user }) {
    return (
        <div className="surface border border-theme rounded-3xl p-6">
            <div className="flex items-center gap-5">
                <LazyImage
                    src={user?.avatarUrl || "/avatars/default-avatar.png"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-blue-500"
                    wrapperClass="w-24 h-24 rounded-full"
                />

                <div>
                    <h2 className="text-3xl text-[color:var(--text)] font-bold">
                        {user?.fullName || user?.name || "Ankit Yadav"}
                    </h2>

                    <div className="flex items-center gap-2 mt-2 text-[color:var(--text-secondary)]">
                        <Mail size={16} />
                        {user?.email}
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-[color:var(--text-secondary)]">
                        <Calendar size={16} />
                        Joined Fitness Monolith
                    </div>
                </div>
            </div>
        </div>
    );
}