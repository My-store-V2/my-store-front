
import api from "./server";
export async function signUp(data) {
    try {
        const response = await api.post("/auth/register", data);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function login(data) {
    try {
        const response = await api.post("/auth/login", data);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getUser() {
    try {
        const response = await api.get("/profil");
        return response.data;
    } catch (error) {
        console.log(error)
    }
}