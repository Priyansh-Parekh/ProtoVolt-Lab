import mongoose from "mongoose";
const connect = mongoose.connect;
// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const connString = process.env.URI;
    if (!connString) {
        console.error('❌ URI not found in .env file. Please add it.');
        process.exit(1);
    }
    await mongoose.connect(connString);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

export default connectDB;