import toast from "react-hot-toast";

export const handleApiError = (error) => {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                toast.error("Bad Request");
                break;

            case 401:
                toast.error("Session expired. Login again.");
                break;

            case 403:
                toast.error("Access denied.");
                break;

            case 404:
                toast.error("Resource not found.");
                break;

            case 500:
                toast.error("Internal Server Error.");
                break;

            default:
                toast.error("Something went wrong.");
        }

        return error.response.data?.message;
    }

    toast.error("Network Error");
    return "Network Error";
};