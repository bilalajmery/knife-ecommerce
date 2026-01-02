async function test() {
    const baseUrl = 'http://localhost:3000/api/admin/products';

    console.log("Testing GET " + baseUrl);
    try {
        const res = await fetch(baseUrl);
        const text = await res.text(); // Read once

        if (res.ok) {
            console.log("GET /products Success", text.substring(0, 100));
        } else {
            console.error("GET /products Failed", res.status, text);
        }
    } catch (e) {
        console.error("Fetch failed", e.message);
    }
}

test();
