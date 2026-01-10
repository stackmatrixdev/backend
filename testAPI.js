// Test API endpoints
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const API_BASE = "http://localhost:5000/api";

async function testAPIs() {
  console.log("🧪 Testing API Endpoints...\n");

  // Test 1: Get all programs (public)
  console.log("1. Testing GET /api/programs (public)");
  try {
    const response = await fetch(`${API_BASE}/programs`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    console.log(`   Programs found: ${data.data?.length || 0}`);

    if (data.data && data.data.length > 0) {
      const firstProgram = data.data[0];
      console.log(
        `   First program: "${firstProgram.title}" (ID: ${firstProgram._id})`
      );

      // Test 2: Get documents for first program (without auth)
      console.log(
        `\n2. Testing GET /api/programs/${firstProgram._id}/documents (no auth)`
      );
      const docResponse = await fetch(
        `${API_BASE}/programs/${firstProgram._id}/documents`
      );
      const docData = await docResponse.json();
      console.log(`   Status: ${docResponse.status}`);
      console.log(`   Success: ${docData.success}`);
      console.log(`   Free docs: ${docData.data?.free?.length || 0}`);
      console.log(`   Premium docs: ${docData.data?.premium?.length || 0}`);

      if (docData.data?.free?.length > 0) {
        console.log(`   First free doc: "${docData.data.free[0].title}"`);
      }
    }
  } catch (error) {
    console.error("   Error:", error.message);
  }

  console.log("\n✅ API Test Complete");
}

testAPIs();
