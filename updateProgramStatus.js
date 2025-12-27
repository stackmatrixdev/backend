import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function updatePrograms() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Program = mongoose.connection.collection('programs');
    
    const result = await Program.updateMany(
      { status: 'draft' },
      { $set: { status: 'published', isActive: true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} programs to published status`);
    
    // Show all programs
    const allPrograms = await Program.find({}).toArray();
    console.log('\n📋 All Programs:');
    allPrograms.forEach(p => {
      console.log(`  - ${p.name}: status=${p.status}, isActive=${p.isActive}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePrograms();
