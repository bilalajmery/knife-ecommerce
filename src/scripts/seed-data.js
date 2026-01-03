import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const seedData = async () => {
    try {
        const { default: dbConnect } = await import("../lib/db.js");
        const { default: Category } = await import("../models/Category.js");
        const { default: Product } = await import("../models/Product.js");

        await dbConnect();
        console.log("Connected to database...");

        // 1. Clear existing data (Optional, but good for clean seeding)
        // await Category.deleteMany({});
        // await Product.deleteMany({});
        // console.log("Cleared existing data.");

        // 2. Categories (20 categories)
        const categoriesData = [
            { name: "Chef Knives", description: "Professional grade kitchen blades for masters of the culinary arts.", image: "/hero-kitchen.png", slug: "chef-knives" },
            { name: "Hunting Knives", description: "Rugged and dependable tools for the great outdoors.", image: "/hero-knife.png", slug: "hunting-knives" },
            { name: "Tactical Knives", description: "Precision-engineered for high-stakes environments.", image: "/hero-tactical.png", slug: "tactical-knives" },
            { name: "Pocket Knives", description: "Compact everyday carry essentials.", image: "/hero-knife.png", slug: "pocket-knives" },
            { name: "Folding Knives", description: "Versatile blades that go wherever you do.", image: "/hero-knife.png", slug: "folding-knives" },
            { name: "Fixed Blade Knives", description: "Uncompromising strength and durability.", image: "/hero-knife.png", slug: "fixed-blade-knives" },
            { name: "Throwing Knives", description: "Balanced for precision and flight.", image: "/hero-knife.png", slug: "throwing-knives" },
            { name: "Survival Knives", description: "Your ultimate companion in the wild.", image: "/hero-knife.png", slug: "survival-knives" },
            { name: "Multitools", description: "A toolbox in your pocket.", image: "/hero-knife.png", slug: "multitools" },
            { name: "Sharpeners", description: "Keep your edge razor-sharp.", image: "/hero-knife.png", slug: "sharpeners" },
            { name: "Knife Rolls", description: "Protect and carry your collection in style.", image: "/hero-kitchen.png", slug: "knife-rolls" },
            { name: "Display Cases", description: "Showcase your finest blades.", image: "/hero-knife.png", slug: "display-cases" },
            { name: "Machetes", description: "Heavy-duty tools for heavy-duty work.", image: "/hero-knife.png", slug: "machetes" },
            { name: "Scalpels", description: "Ultra-precise surgical-grade blades.", image: "/hero-knife.png", slug: "scalpels" },
            { name: "Karambits", description: "Curved defensive blades with a tactical edge.", image: "/hero-tactical.png", slug: "karambits" },
            { name: "Butterfly Knives", description: "The iconic balisong style.", image: "/hero-knife.png", slug: "butterfly-knives" },
            { name: "Kitchen Sets", description: "Complete collections for any kitchen.", image: "/hero-kitchen.png", slug: "kitchen-sets" },
            { name: "Santoku Knives", description: "The Japanese standard for versatile cutting.", image: "/hero-kitchen.png", slug: "santoku-knives" },
            { name: "Fillet Knives", description: "Flexible blades for perfect fish prep.", image: "/hero-kitchen.png", slug: "fillet-knives" },
            { name: "Cleavers", description: "Force and weight for the toughest cuts.", image: "/hero-kitchen.png", slug: "cleavers" },
        ];

        console.log("Seeding categories...");
        const createdCategories = [];
        for (const cat of categoriesData) {
            const existing = await Category.findOne({ slug: cat.slug });
            if (!existing) {
                const c = await Category.create(cat);
                createdCategories.push(c);
            } else {
                createdCategories.push(existing);
            }
        }
        console.log(`Seeded/Found ${createdCategories.length} categories.`);

        // 3. Products (100 products)
        console.log("Seeding 100 products...");
        const products = [];
        const adjectives = ["Premium", "Tactical", "Stealth", "Carbon", "Damascus", "Artisan", "Shadow", "Ghost", "Titan", "Rogue"];
        const nouns = ["Edge", "Blade", "Striker", "Cutter", "Standard", "Elite", "Pro", "Custom", "Master", "Warrior"];

        for (let i = 1; i <= 100; i++) {
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const category = createdCategories[i % createdCategories.length];
            const name = `${adj} ${category.name.replace(" Knives", "")} ${noun} v${i}`;
            const slug = `${name.toLowerCase().replace(/ /g, "-")}-${Date.now()}-${i}`;
            const sku = `SKU-${category.slug.substring(0, 3).toUpperCase()}-${1000 + i}`;

            // Random price between 49 and 499
            const price = parseFloat((Math.random() * (499 - 49) + 49).toFixed(2));

            products.push({
                name,
                slug,
                sku,
                description: `This is a high-quality ${name}. It features a durable design and precision-engineered blade perfect for ${category.name.toLowerCase()}.`,
                features: "• High-carbon steel\n• Ergonomic handle\n• Corrosion resistant\n• Lifetime warranty",
                specifications: `Blade Length: ${3 + (i % 5)} inches\nWeight: ${5 + (i % 10)} oz\nMaterial: Grade A Steel`,
                materials: "High-Carbon Stainless Steel, G10 Handle",
                dimensions: `${8 + (i % 4)} inches total length`,
                usage: `Designed for ${category.name.toLowerCase()}.`,
                category: category._id,
                price,
                discount: i % 10 === 0 ? 15 : 0, // 10% of items have a 15% discount
                mainImage: category.image || "/hero-knife.png",
                hoverImage: "/hero-knife.png",
                galleryImages: [category.image || "/hero-knife.png", "/hero-knife.png"],
                status: "active",
                metaTitle: `${name} | KnifeMasters`,
                metaDescription: `Buy the ${name} online at the best price. High quality ${category.name} available.`
            });
        }

        await Product.insertMany(products);
        console.log("Successfully seeded 100 products.");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
