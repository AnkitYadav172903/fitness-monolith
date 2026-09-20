export async function retryRequest(request, retries = 2, delay = 1000) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await request();
        } catch (error) {
            const status = error?.response?.status;
            const isClientError = status >= 400 && status < 500;

            if (isClientError || i === retries) throw error;

            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}