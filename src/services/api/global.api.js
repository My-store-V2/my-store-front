export async function getCityByCode(code) {
    try {
        const res = await fetch(`https://apicarto.ign.fr/api/codes-postaux/communes/${code}`, {
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

