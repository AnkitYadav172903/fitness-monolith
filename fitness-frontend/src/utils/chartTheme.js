const cssVar = (name) =>
    (typeof window !== "undefined" &&
        getComputedStyle(document.documentElement).getPropertyValue(name).trim()) ||
    "";

const FALLBACKS = {
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#0EA5E9",
    text: "#64748B",
    label: "#0F172A",
    grid: "#E2E8F0",
    surface: "#FFFFFF",
    border: "#E2E8F0",
};

export function chartTheme() {
    const resolve = (key) => cssVar(`--${key}`) || FALLBACKS[key];

    return {
        primary: resolve("primary"),
        primaryHover: resolve("primary-hover"),
        success: resolve("success"),
        warning: resolve("warning"),
        danger: resolve("danger"),
        info: resolve("info"),
        text: resolve("text-secondary"),
        label: resolve("text"),
        grid: resolve("border"),
        surface: resolve("surface"),
        border: resolve("border"),
    };
}

export function tooltipStyle() {
    const t = chartTheme();

    return {
        contentStyle: {
            backgroundColor: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: "12px",
            color: t.label,
            boxShadow: "0 8px 24px -6px rgb(15 23 42 / 0.18)",
        },
        labelStyle: { color: t.label },
        itemStyle: { color: t.label },
    };
}

export const legendTextStyle = {
    fontSize: 12,
};