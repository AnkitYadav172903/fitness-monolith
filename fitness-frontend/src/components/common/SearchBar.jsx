import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
    return (
        <div className="relative w-full">
            <Search
                size={20}
                className="absolute left-4 top-3.5 text-[color:var(--text-secondary)]"
            />

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search activities..."
                className="w-full pl-12 pr-4 py-3 rounded-xl surface-secondary text-[color:var(--text)] border border-theme focus:border-blue-500 outline-none"
            />
        </div>
    );
}