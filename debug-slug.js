const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// We need to match the connection logic briefly or just connect directly if we know the URI
// Assuming MONGODB_URI is in .env.local or .env

// Mocking the model since we can't easily import ES modules in this standalone script without setup
// Better to just use a simple connection and query
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/knife-ecommerce"; // Fallback or read from file

async function checkProduct() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        // access collection directly
        const collection = mongoose.connection.collection('products');
        const slug = "digital-elliptical-4762";

        const product = await collection.findOne({ slug: slug });

        if (product) {
            console.log("FOUND PRODUCT:", JSON.stringify(product, null, 2));
        } else {
            console.log("PRODUCT NOT FOUND with slug:", slug);

            // List all slugs to see what exists
            const allProducts = await collection.find({}, { projection: { slug: 1, name: 1 } }).toArray();
            console.log("Available Slugs:", allProducts.map(p => `${p.slug} (${p.name})`));
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

checkProduct();
