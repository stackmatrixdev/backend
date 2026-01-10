// Quick script to check documents in database
import mongoose from "mongoose";
import dotenv from "dotenv";
import Program from "./models/Program.model.js";

dotenv.config();

async function checkDocuments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const programs = await Program.find({});

    console.log("\n📊 === ALL PROGRAMS ===\n");

    programs.forEach((program, index) => {
      console.log(
        `${index + 1}. Program: "${
          program.title || program.name || "No Title"
        }"`
      );
      console.log(`   ID: ${program._id}`);
      console.log(`   Category: ${program.category || "No Category"}`);
      console.log(
        `   Description: ${
          program.description
            ? program.description.substring(0, 50) + "..."
            : "No Description"
        }`
      );
      console.log(`   Free docs: ${program.documentation?.free?.length || 0}`);
      console.log(
        `   Premium docs: ${program.documentation?.premium?.length || 0}`
      );
      console.log("");
    });

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkDocuments();
