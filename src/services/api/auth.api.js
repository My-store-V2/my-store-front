
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

export async function editUser(data) {
    try {
        const response = await api.put("/profil", data);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function checkToken() {
    try {
        let storeToken = localStorage.getItem('storeToken');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/checkToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${storeToken}`
            }
        });
        return res.json();
    } catch (error) {
        console.log('error: ',error)
    }

} 