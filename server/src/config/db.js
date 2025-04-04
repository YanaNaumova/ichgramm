import mongoose from "mongoose";
import "dotenv/config";

async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_LOCAL,
      {
        // authSource: "admin",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("connect to Db");
  } catch (error) {
    console.error("Failed connect to DB");
    console.error(error);
    process.exit(1);
  }
}

export default connectDB;
