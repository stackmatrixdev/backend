// Test script to verify category validation fix
// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:5000/api';

// Test data with correct category
const testTrainingData = {
  programData: {
    name: "Test Training Program",
    topic: "Tech & Development", 
    category: "Development", // Using correct enum value now
    description: "A test training program to verify category validation",
    level: "Beginner",
    estimatedDuration: 30
  },
  examSimulator: {
    questions: [
      {
        text: "What is Node.js?",
        type: "Single Choice MCQ",
        marks: 3,
        level: "Beginner",
        options: ["A JavaScript runtime", "A database", "A web browser", "A text editor"],
        correctAnswer: 0
      }
    ],
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    showCorrectAnswers: true,
    allowReview: true
  }
};

async function testCategoryValidation() {
  try {
    console.log('🧪 Testing category validation fix...');
    console.log('📤 Sending request with category:', testTrainingData.programData.category);
    
    const response = await fetch(`${API_BASE}/quiz/program-with-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: You would need a real auth token for this to work
        'Authorization': 'Bearer your-auth-token-here'
      },
      body: JSON.stringify(testTrainingData)
    });

    const result = await response.json();
    
    console.log('\n📋 Response Status:', response.status);
    console.log('📋 Response Body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ SUCCESS: Category validation is working!');
      console.log('🎉 Training program created successfully');
    } else {
      if (result.error && result.error.errors && result.error.errors.category) {
        console.log('\n❌ FAILED: Category validation error still exists');
        console.log('🔍 Error details:', result.error.errors.category.message);
      } else {
        console.log('\n⚠️  Request failed for other reasons (possibly auth)');
        console.log('🔍 Error:', result.message);
      }
    }
  } catch (error) {
    console.error('\n💥 Network/Connection Error:', error.message);
  }
}

// Test with invalid category to verify validation works
async function testInvalidCategory() {
  const invalidData = {
    ...testTrainingData,
    programData: {
      ...testTrainingData.programData,
      category: "Technology" // This should fail
    }
  };

  try {
    console.log('\n🧪 Testing with invalid category "Technology"...');
    
    const response = await fetch(`${API_BASE}/quiz/program-with-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-auth-token-here'
      },
      body: JSON.stringify(invalidData)
    });

    const result = await response.json();
    
    if (!response.ok && result.error && result.error.errors && result.error.errors.category) {
      console.log('✅ EXPECTED: Invalid category "Technology" correctly rejected');
      console.log('🔍 Error message:', result.error.errors.category.message);
    } else {
      console.log('⚠️  Unexpected: Invalid category was accepted or other error occurred');
    }
  } catch (error) {
    console.error('💥 Network Error:', error.message);
  }
}

// Run tests
console.log('🚀 Starting Category Validation Tests\n');
await testCategoryValidation();
await testInvalidCategory();

console.log('\n📝 Summary:');
console.log('- Updated all frontend components to use correct categories');
console.log('- Valid categories are:', testTrainingData.programData.category);
console.log('- Removed invalid categories like "Technology", "Financial", etc.');
console.log('\n💡 The category validation error should now be resolved!');