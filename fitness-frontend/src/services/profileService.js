import api from "./api";

export const getProfile = async () => {
    try {
        const response = await api.get("/user/profile");
        return response.data;
    } catch {
        try {
            const saved = JSON.parse(
                localStorage.getItem("fitness_user") || "null"
            );
            return saved || {};
        } catch {
            return {};
        }
    }
};

export const updateProfile = async (profileData) => {
    const response = await api.put("/user/profile", profileData);
    const updated = response.data;

    const saved = JSON.parse(
        localStorage.getItem("fitness_user") || "null"
    );
    if (saved) {
        const fullName =
            [updated.firstName, updated.lastName].filter(Boolean).join(" ").trim() ||
            updated.email ||
            "";
        localStorage.setItem(
            "fitness_user",
            JSON.stringify({
                ...saved,
                ...updated,
                fullName,
            })
        );
    }

    return updated;
};

export const updatePassword = async (data) => {
    const response = await api.put("/user/password", data);
    return response.data;
};