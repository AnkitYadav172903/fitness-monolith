import { useState } from "react";
import { Trash2, LogOut } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../services/authService";

import AnimatedButton from "../common/AnimatedButton";

export default function DangerZone() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleDelete = async () => {
        if (!window.confirm("This will permanently delete your account and all associated data. Continue?")) {
            return;
        }

        setDeleting(true);
        try {
            await deleteUser();
            logout();
            navigate("/login");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="bg-red-950 border border-red-700 rounded-2xl p-6">
            <h2 className="text-red-400 text-xl font-bold">
                Danger Zone
            </h2>

            <p className="text-red-300 mt-2">
                These actions affect your account permanently.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
                <AnimatedButton
                    onClick={handleLogout}
                    className="bg-orange-600 hover:bg-orange-700 rounded-xl p-3 text-white flex justify-center gap-2 items-center"
                >
                    <LogOut size={18} />
                    Logout
                </AnimatedButton>

                <AnimatedButton
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 rounded-xl p-3 text-white flex justify-center gap-2 items-center"
                >
                    <Trash2 size={18} />
                    {deleting ? "Deleting..." : "Delete Account"}
                </AnimatedButton>
            </div>
        </div>
    );
}