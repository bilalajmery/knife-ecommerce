const fs = require('fs');

async function testPost() {
    const form = new FormData();
    form.append("name", "Test Large Product");
    form.append("price", "100");
    form.append("category", "6766723b7821617b70366606");
    form.append("status", "active");

    // Create a large buffer (> 10MB)
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024, 'a'); // 11MB
    const blob = new Blob([largeBuffer], { type: 'text/plain' });

    form.append("mainImage", blob, "large_main.txt");
    form.append("hoverImage", blob, "large_hover.txt");
    // Minimal gallery
    const smallBlob = new Blob(["small"], { type: 'text/plain' });
    form.append("galleryImages", smallBlob, "gallery1.txt");
    form.append("galleryImages", smallBlob, "gallery2.txt");

    console.log("Sending POST request with large payload (>10MB)...");
    try {
        const res = await fetch("http://localhost:3000/api/admin/products", {
            method: "POST",
            body: form
        });

        const text = await res.text();
        console.log("Response Status:", res.status);
        console.log("Response Body:", text);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testPost();
