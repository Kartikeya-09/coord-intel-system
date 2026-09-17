require('dotenv').config();
const mongoose = require('mongoose');
const { connectDb, disconnectDb } = require('../utils/connectDb');

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
