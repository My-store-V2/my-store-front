import api from "./server";

export async function getProducts(take) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?take=${take}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function getWishList() {
    try {
        const response = await api.get("/wishlist");
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function addToWishList(data) {
    try {
        const response = await api.post("/wishlist", data);
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFromWishList(id) {
    try {
        const response = await api.delete(`/wishlist/${id}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getProduct(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${id}`, {
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}
