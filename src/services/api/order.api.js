import api from "./server";

export async function getOrderList() {
    try {
        const response = await api.get("/orders");
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
export async function getOrder(id) {
    try {
        const res = await api.get(`/orders/${id}`, {
            cache: "no-store",
        });
        console.log(res)
        return res.data;
    }
    catch (err) {
        return err;
    }
}

export async function editOrder(id, status) {
    try {
        const res = await api.put(`/orders/${id}`, {
            newStatus: status,
        });
        console.log(res)
        return res.data;
    }
    catch (err) {
        return err;
    }
}


