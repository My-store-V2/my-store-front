import api from "./server";

export async function checkout(data) {
    try {
        const response = await api.post("/order", data);
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}