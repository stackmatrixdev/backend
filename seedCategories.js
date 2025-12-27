import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.model.js";

dotenv.config();

const initialCategories = [
  "Development",
  "Business",
  "Marketing",
  "Lifestyle",
  "Music",
  "Design",
  "Academics",
  "Health & Fitness",
  "Productivity",
  "Accounting",
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} categories already exist. Skipping seed.`);
      process.exit(0);
    }

    // Create initial categories
    const categories = initialCategories.map(name => ({
      name,
      isActive: true,
    }));

    await Category.insertMany(categories);
    console.log(`✅ Successfully seeded ${categories.length} categories`);
    
    // List all categories
    const allCategories = await Category.find();
    console.log("\n📋 Categories in database:");
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
