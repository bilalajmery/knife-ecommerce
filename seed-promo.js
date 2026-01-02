const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define Promo Schema locally to avoid import issues with modules without Babel
const PromoSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discount: { type: Number, required: true },
        maxUsage: { type: Number, default: -1 },
        usedCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Promo = mongoose.models.Promo || mongoose.model('Promo', PromoSchema);

async function seedPromo() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is undefined");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB via Mongoose");

        const code = "TEST101";

        let promo = await Promo.findOne({ code });

        if (promo) {
            console.log(`Promo ${code} already exists.`);
            promo.discount = 20; // Ensure discount is 20
            promo.isActive = true;
            await promo.save();
            console.log(`Promo ${code} updated to 20% discount and active.`);
        } else {
            promo = await Promo.create({
                code,
                discount: 20,
                isActive: true
            });
            console.log(`Promo ${code} created with 20% discount.`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error seeding promo:", error);
        process.exit(1);
    }
}

seedPromo();
