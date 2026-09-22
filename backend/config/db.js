const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techstore', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(`Tip: If you are using MongoDB Atlas, make sure MONGO_URI is set in backend/.env with your cluster credentials.`);
    console.warn(`If running locally, ensure the MongoDB service (mongod) is started.`);
  }
};

module.exports = connectDB;
