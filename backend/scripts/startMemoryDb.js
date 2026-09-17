import 'dotenv/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

async function start() {
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'cis'
      }
    });

    console.log('\n======================================================');
    console.log('⚡ Standalone MongoDB Server Running on Port 27017!');
    console.log(`Connection URI: mongodb://127.0.0.1:27017/cis`);
    console.log('Keep this terminal open to keep the database active.');
    console.log('MongoDB Compass & Backend API can connect to port 27017.');
    console.log('======================================================\n');
  } catch (err) {
    if (err.message && err.message.includes('EADDRINUSE')) {
      console.log('Port 27017 is already in use by another MongoDB service.');
    } else {
      console.error('Failed to start MongoDB server:', err);
    }
  }
}

start();
