import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@sterlingbotanica.com";
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️ Admin user already exists: ${adminEmail}`);
      process.exit(0);
    }

    // Create admin
    const adminUser = new User({
      name: "Super Admin",
      email: adminEmail,
      password: "adminpassword123", // Password will be hashed by pre-save hook
      role: "admin",
      phone: "9999999999"
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log("Password: adminpassword123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
