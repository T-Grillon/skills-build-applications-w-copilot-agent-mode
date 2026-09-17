import mongoose from 'mongoose';

export const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

export async function connectDatabase(): Promise<typeof mongoose> {
  if (db.readyState === 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
    return mongoose;
  } catch (error) {
    console.error('Error connecting to octofit_db:', error);
    throw error;
  }
}

db.on('error', console.error.bind(console, 'connection error:'));

export default db;
