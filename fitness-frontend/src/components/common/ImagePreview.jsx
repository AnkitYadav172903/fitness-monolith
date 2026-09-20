import { Camera } from "lucide-react";

export default function ImagePreview({ src, onSelect, onClear, inputRef }) {
    return (
        <div className="relative">
            <img
                src={src}
                alt="Avatar Preview"
                className="w-36 h-36 rounded-full object-cover border-4 border-cyan-500"
            />

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center cursor-pointer shadow-lg"
            >
                <Camera size={18} />
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onSelect(e.target.files[0])}
            />

            {onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white text-sm"
                >
                    ✕
                </button>
            )}
        </div>
    );
}