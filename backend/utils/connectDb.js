const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memServer = null;

/**
 * Robust database connection helper.
 * If process.env.MONGO_URI is set (e.g. MongoDB Atlas cloud), connects directly to it.
 * If local localhost URI is used and local MongoDB is not running, falls back to embedded MongoMemoryServer.
 */
async function connectDb() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cis';
  const isCloudUri = process.env.MONGO_URI && process.env.MONGO_URI.includes('mongodb+srv://');

  try {
    const timeout = isCloudUri ? 15000 : 2000;
    console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

    await mongoose.connect(uri, { serverSelectionTimeoutMS: timeout });
    console.log(`✓ Successfully connected to MongoDB!`);
    return uri;
  } catch (err) {
    if (!isCloudUri && err.message && (err.message.includes('ECONNREFUSED') || err.name === 'MongooseServerSelectionError')) {
      console.log('Local MongoDB service not detected on port 27017.');
      console.log('Starting embedded MongoDB Memory Server fallback...');

      try {
        memServer = await MongoMemoryServer.create({
          instance: { port: 27017, dbName: 'cis' }
        });
      } catch (portErr) {
        memServer = await MongoMemoryServer.create({ instance: { dbName: 'cis' } });
      }

      const memUri = memServer.getUri();
      await mongoose.connect(memUri);
      console.log(`✓ Embedded MongoDB Memory Server started successfully at ${memUri}`);
      return memUri;
    } else {
      console.error('Failed to connect to configured MongoDB URI:', err.message);
      throw err;
    }
  }
}

async function disconnectDb() {
  await mongoose.disconnect();
  if (memServer) {
    await memServer.stop();
  }
}

module.exports = { connectDb, disconnectDb };
