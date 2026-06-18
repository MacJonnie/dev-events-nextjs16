import mongoose from "mongoose";

const MONGODB_URI= process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const mongoDbUri: string = MONGODB_URI;  // resign the connection variable to avoid type error in the connectToDatabase function.

/**
 * Type definition for the cached mongoose connection.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: ReturnType<typeof mongoose.connect> | null;
}

/**
 * Extend the global object to store the cached connection.
 * This prevents multiple connections during hot reloads in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

/**
 * Connect to MongoDB using Mongoose.
 * Reuses an existing connection if available.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return cached connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    const options = {
      bufferCommands: false,  // set to false to prevent Mongoose from buffering commands if the connection is not yet established
    };

    cached.promise = mongoose
      .connect(mongoDbUri, options)
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

