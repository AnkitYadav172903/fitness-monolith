import { useState } from "react";

export default function LazyImage({ src, alt, className = "", wrapperClass = "" }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${wrapperClass}`}>
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-[color:var(--surface-secondary)]" />
            )}

            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`${className} ${
                    loaded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500`}
            />
        </div>
    );
}