import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../utils/connectDb.js';

async function clearDemo() {
  try {
    await connectDb();

    const collections = Object.keys(mongoose.connection.collections);
    for (const name of collections) {
      await mongoose.connection.collections[name].drop().catch(() => {});
      console.log(`Dropped collection: ${name}`);
    }

    console.log('Database cleared successfully.');
  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await disconnectDb();
  }
}

clearDemo();
