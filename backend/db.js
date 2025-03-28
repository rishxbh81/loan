const dotenv = require('dotenv');
dotenv.config();  

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);  
  }
};

module.exports = connectDB;
