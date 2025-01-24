import mongoose from "mongoose";
import "dotenv/config";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL || MONGO_URI_ATLAS, {
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
