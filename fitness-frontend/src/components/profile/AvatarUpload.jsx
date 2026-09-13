import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import ImagePreview from "../common/ImagePreview";

export default function AvatarUpload() {
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState(null);
    const inputRef = useRef(null);

    const handleSelect = (file) => {
        if (!file) return;

        setSelected({
            file,
            url: URL.createObjectURL(file),
        });
    };

    const clearSelection = () => {
        if (selected?.url) URL.revokeObjectURL(selected.url);

        setSelected(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const uploadAvatar = async () => {
        if (!selected?.file) return;

        const formData = new FormData();

        formData.append("avatar", selected.file);

        try {
            setUploading(true);

            await api.post("/user/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Avatar Uploaded");

            clearSelection();
        } catch {
            toast.error("Upload Failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="surface border border-theme rounded-2xl p-6 flex flex-col items-center">
            <ImagePreview
                src={selected?.url || "/avatars/default-avatar.png"}
                onSelect={handleSelect}
                onClear={selected ? clearSelection : undefined}
                inputRef={inputRef}
            />

            <button
                type="button"
                onClick={uploadAvatar}
                disabled={!selected || uploading}
                className="mt-5 cursor-pointer bg-blue-600 px-4 py-2 rounded-lg text-white flex items-center gap-2 disabled:opacity-50"
            >
                <Camera size={18} />
                {uploading ? "Uploading..." : "Upload Avatar"}
            </button>

            <p className="text-[color:var(--text-secondary)] mt-4 text-sm">
                JPG, PNG (Max 2 MB)
            </p>
        </div>
    );
}