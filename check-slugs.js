const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ProductSchema = new mongoose.Schema({
    name: String,
    slug: String
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function checkSlugs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);
        products.forEach(p => {
            console.log(`Product: ${p.name}, Slug: ${p.slug}, ID: ${p._id}`);
            if (!p.slug) {
                console.log(`WARNING: Product ${p.name} has no slug!`);
            }
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSlugs();
