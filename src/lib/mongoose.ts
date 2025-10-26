import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env");
}

let cached : {
  connection: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
} = (global as any).mongoose || { connection: null, promise: null };

if(!(global as any).mongoose){
(global as any).mongoose = cached;
}

export default async function databaseConnect (): Promise<mongoose.Connection> {
  if(cached.connection){
    return cached.connection;
  };
  if(!cached.promise){
    console.log("Connecting to database...");
    cached.promise = mongoose.connect(MONGODB_URI!).then((conn) => conn.connection);
  }

  cached.connection = await cached.promise;
  console.log("Database connected");
  return cached.connection;
}
