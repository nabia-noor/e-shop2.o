const mongoose = require("mongoose");

const connectDatabase = () => {
    const mongoURI = process.env.DB_URI || process.env.DB_URL || "mongodb://localhost:27017/eshop";

    mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    }).then((data) => {
        console.log(`MongoDB connected with server: ${data.connection.host}`)
    }).catch((error) => {
        console.error("MongoDB connection error:", error.message);
        console.error("Make sure MongoDB is running on your system");
        process.exit(1);
    })
}

module.exports = connectDatabase;