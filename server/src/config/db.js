import mongoose from "mongoose";
import "dotenv/config";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // user: process.env.MONGO_INITDB_ROOT_USERNAME || "root",
      // password: process.env.MONGO_INITDB_ROOT_PASSWORD || "root",
      // user: process.env.MONGO_INITDB_ROOT_USERNAME || "root",
      // password: process.env.MONGO_INITDB_ROOT_PASSWORD || "root",
      authSource: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connect to DB");
  } catch (error) {
    console.error("Failed connect to DB");
    console.error(error);
    process.exit(1);
  }
}

export default connectDB;
