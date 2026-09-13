import api from "./api";

const normalizeUser = (data) => {
    const { token, user } = data;

    const fullName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
        user?.email ||
        "";

    return {
        token,
        user: {
            id: user?.id,
            email: user?.email,
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            fullName,
        },
    };
};

export const loginUser = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return normalizeUser(response.data);
};

export const deleteUser = async () => {
    await api.delete("/user");
};

export const registerUser = async (registerData) => {
    const [firstName = "", lastName = ""] = (registerData.fullName || "")
        .trim()
        .split(/\s+/);

    const response = await api.post("/auth/register", {
        email: registerData.email,
        password: registerData.password,
        firstName,
        lastName,
    });

    return normalizeUser({ user: response.data });
};