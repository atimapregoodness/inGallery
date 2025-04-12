const multer = require("multer");
const { storage } = require("../cloudinary");
const UploadImg = require("../models/upload");
const PublishImg = require("../models/publish");
const upload = multer({ storage });
const path = require("path");
const cloudinary = require("cloudinary").v2;

exports.getProfile = async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.flash("error", "You must be logged in to view this page.");
    return res.redirect("/auth/login");
  }
  const user = req.user;
  console.log(user);
  res.render("user/acct/profile", { user });
};

exports.getEditProfile = async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.flash("error", "You must be logged in to view this page.");
    return res.redirect("/auth/login");
  }
  const user = req.user;
  res.render("user/acct/editProfile", { user });
};

exports.postEditProfile = async (req, res) => {
  console.log(req.file);
  if (req.isAuthenticated()) {
    try {
      const { profileImg } = req.body;
      console.log(profileImg);

      if (profileImg === "/assets/images/no-profile.png") {
        // Delete existing Cloudinary image, if any
        if (req.user && req.user.profileImg) {
          await cloudinary.uploader.destroy(req.user.profileImg);
        }

        // Set the profile image to the default image
        req.user.profileImg = profileImg;
        await req.user.save();
        req.flash("success", "Profile Photo successfully updated");
      } else if (req.file) {
        // Upload new image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_pictures", // Store images in a specific folder
        });

        // Delete existing Cloudinary image, if any
        if (req.user.profileImg) {
          await cloudinary.uploader.destroy(req.user.profileImg);
        }

        // Update the user profile with the new image URL
        req.user.profileImg = uploadResponse.secure_url; // Get the new image URL
        await req.user.save();
        console.log(req.user);
        req.flash("success", "Profile Photo successfully updated");
      }

      res.redirect("/user/profile");
    } catch (err) {
      console.error("Error occurred:", err);
      req.flash("error", `${err.message}`);
      res.redirect("/user/profile/edit-profile");
    }
  } else {
    req.flash("error", "Please login first");
    res.redirect("/auth/login");
  }
};
