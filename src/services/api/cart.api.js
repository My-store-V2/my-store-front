import api from "./server";

export async function getCartList() {
    try {
        const response = await api.get("/cart");
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function addToCartList(data) {
    try {
        const response = await api.post("/cart", data);
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFromCartList(data) {
    try {
        const response = await api.delete("/cart", { data });
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
