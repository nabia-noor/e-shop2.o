const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const connectDatabase = require("./db/database");
const Event = require("./models/event");

// Load environment variables
const configDotEnvPath = path.resolve(__dirname, "config/.env");
const rootDotEnvPath = path.resolve(__dirname, ".env");
const chosenPath = fs.existsSync(configDotEnvPath)
    ? configDotEnvPath
    : rootDotEnvPath;
require("dotenv").config({ path: chosenPath });

async function updateIphoneImageFromBestDeals() {
    try {
        // Connect to database
        connectDatabase();

        // Wait for connection to be established
        let attempts = 0;
        while (mongoose.connection.readyState !== 1 && attempts < 10) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempts++;
        }

        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database connection failed");
        }

        // Find the iPhone event
        const iphoneEvent = await Event.findOne({ name: /iphone.*14pro.*max/i });

        if (!iphoneEvent) {
            console.log("❌ iPhone event not found!");
            process.exit(1);
        }

        console.log("Found iPhone event:", iphoneEvent.name);
        console.log("Current image:", iphoneEvent.images?.[0]?.url);

        // Use the same image URL from BestDeals (from static/data.js)
        const imageUrl = "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg";

        // Update the event with the image URL from BestDeals
        iphoneEvent.images = [
            {
                public_id: "external",
                url: imageUrl
            }
        ];

        await iphoneEvent.save();

        console.log("✅ iPhone event image updated successfully!");
        console.log("Image URL (from BestDeals):", imageUrl);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error updating iPhone image:", error.message);
        console.error(error);
        process.exit(1);
    }
}

updateIphoneImageFromBestDeals();

