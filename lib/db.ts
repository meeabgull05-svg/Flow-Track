import mongoose from 'mongoose';

/**
 * Serverless-friendly MongoDB connection function using Mongoose.
 * Caches connection instance across function invocations on Vercel/Cloud Run.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGO_URI) {
      console.warn('[MongoDB] MONGO_URI is not set in environment variables.');
      return null;
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      console.log('[MongoDB] Connected successfully to Atlas');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
