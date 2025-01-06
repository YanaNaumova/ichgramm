import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connect to DB");
  } catch (error) {
    console.error("Failed connect to DB");
    process.exit(1);
  }
}

export default connectDB;
