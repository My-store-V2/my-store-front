import api from "./server";

export async function checkout(data) {
    try {
        let storeToken = localStorage.getItem('storeToken');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${storeToken}`
            },
            body: JSON.stringify(data),
        });
        return res.json();
    }
    catch (err) {
        return err;
    }
}