import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearPrograms() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Program = mongoose.connection.collection('programs');
    
    // Show current programs before deletion
    const beforeCount = await Program.countDocuments();
    console.log(`\n📋 Current programs in database: ${beforeCount}`);
    
    if (beforeCount > 0) {
      const allPrograms = await Program.find({}).toArray();
      console.log('\n📝 Programs to be deleted:');
      allPrograms.forEach(p => {
        console.log(`  - ${p.name} (${p.category})`);
      });
      
      // Delete all programs
      const result = await Program.deleteMany({});
      console.log(`\n🗑️  Deleted ${result.deletedCount} programs`);
    } else {
      console.log('\n✅ Database is already empty');
    }
    
    // Verify deletion
    const afterCount = await Program.countDocuments();
    console.log(`\n📊 Programs remaining: ${afterCount}`);
    
    if (afterCount === 0) {
      console.log('\n✅ Database cleared successfully! You can now create fresh courses.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearPrograms();
