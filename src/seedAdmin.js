if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
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

    // Create new admin user using passport-local-mongoose method
    const newAdmin = new User({
      username: "Admin",
      email: process.env.ADMIN_EMAIL,
      isAdmin: true,
    });

    // Use passport-local-mongoose to register and hash the password
    await User.register(newAdmin, process.env.ADMIN_PASSWORD);

    console.log("✅ Admin user created successfully!");
  } catch (err) {
    console.error("❌ Error creating admin user:", err);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
