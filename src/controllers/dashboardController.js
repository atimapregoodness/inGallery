const multer = require("multer");
const { storage } = require("../cloudinary");
const UploadImg = require("../models/upload");
const PublishImg = require("../models/publish");
const upload = multer({ storage });
const path = require("path");
const cloudinary = require("cloudinary").v2;

exports.getDashboard = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;

      const userDetails = await user.populate("uploadedImages");

      const images = req.user.uploadedImages.map((upload) => upload.img);

      const imgDetails = images.flat(); // Flatten the array and extract URL

      const numberOfImgs = images.length;

      res.render("user/acct/dashboard", {
        userDetails,
        imgDetails,
        numberOfImgs,
      });
    } catch (err) {
      req.flash("error", `${err.message}`);
      res.render("user/acct/dashboard");
    }
  } else {
    req.flash("error", "Please login first");
    res.redirect("/auth/login");
  }
};

exports.getDashboardImages = async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params;

    const imgs = await UploadImg.findById(id).populate("user");

    const isPublished = await PublishImg.findById(id).populate("user");

    res.render("user/acct/imgPreview", { imgs, isPublished });
  } else {
    req.flash("error", "Please login first");
    res.redirect("/auth/login");
  }
};

exports.getUpload = async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("user/acct/upload");
  } else {
    req.flash("error", "Please login first");
    res.redirect("/auth/login");
  }
};

exports.uploadImg = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const img = {
        url: req.file.path,
        filename: req.file.path.split("/").slice(-2).join("/"), // Extracts folder/filename
      };
      const { category, description } = req.body;
      const newImg = new UploadImg({
        img,
        category,
        description,
        user: req.user._id,
      });
      await newImg.save();
      req.user.uploadedImages.push(newImg._id);
      await req.user.save();
      req.flash("success", "Image Upload Successfully");
      res.redirect("/user/upload");
    } catch (err) {
      console.log(err);
      req.flash("error", `${err.message}`);
      res.redirect("/user/upload");
    }
  } else {
    req.flash("error", "Please login first");
    res.redirect("/auth/login");
  }
};

exports.publishImg = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params;

      const imgs = await UploadImg.findById(id);

      const publishedImg = new PublishImg({
        img: imgs.img,
        category: imgs.category,
        description: imgs.description,
        user: req.user._id,
        _id: imgs._id,
      });

      const getImg = await PublishImg.find({
        img: imgs.img,
        category: imgs.category,
        description: imgs.description,
        user: imgs.user,
      });

      if (getImg.length) {
        req.flash("error", "Image has already been published");
      } else {
        req.user.publishedImages.push(publishedImg._id);
        await req.user.save();
        await publishedImg.save();
        req.flash("success", "Image successfully published");
      }
      res.redirect(`/user/dashboard/${id}`);
    } catch (err) {
      req.flash("error", `${err.message}`);
      console.log(err);
      res.redirect(`/user/dashboard/${id}`);
    }
  } else {
    req.flash("error", "Please login first");
    res.redirect("/auth/login");
  }
};

exports.deleteImg = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params;

      // Find the image in Uploads and Published collections
      const imgToDelete = await UploadImg.findById(id);
      const publishedImgDelete = await PublishImg.findById(id);

      // Check if the image exists
      if (!imgToDelete) {
        console.log("Image not found");
        req.flash("error", "Image not found");
        return res.redirect("/user/dashboard");
      }

      // Convert user IDs to string for comparison
      const imgOwnerId = imgToDelete.user.toString();
      const currentUserId = req.user._id.toString();

      console.log(imgOwnerId, currentUserId);

      // Check if the logged-in user is the owner of the image
      if (imgOwnerId !== currentUserId) {
        req.flash("error", "Unauthorized action");
        return res.redirect("/user/dashboard");
      }

      // Extract Cloudinary public ID (folder/filename)
      const publicId = imgToDelete.img.filename.replace(/\.[^/.]+$/, "");

      console.log("Deleting image from Cloudinary: ===========", publicId);

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Cloudinary Delete Error:", error);
        } else {
          console.log("Cloudinary Delete Result:", result);
        }
      });

      // Remove from database;
      await UploadImg.findByIdAndDelete(id);

      if (publishedImgDelete) {
        await PublishImg.findByIdAndDelete(id);
      }

      req.flash("success", "Image deleted successfully");
      res.redirect("/user/dashboard");
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred while deleting the image");
      res.redirect("/user/dashboard");
    }
  }
};
