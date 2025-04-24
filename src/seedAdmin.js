// seedAdmin.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Admin Database connected successfully");

    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existing) {
      console.log("⚠️ Admin already exists.");
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    const newAdmin = new User({
      username: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();
    console.log("✅ Admin user created successfully!");
  } catch (err) {
    console.error("❌ Error creating admin user:", err);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
