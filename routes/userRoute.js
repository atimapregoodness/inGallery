const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const UploadImg = require('../models/upload');
const PublishImg = require('../models/publish');
const upload = multer({ storage });
const path = require('path');
const user = require('../models/user');
// const upload = multer({ dest: "upload" });


router.get('/dashboard', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;

      const userDetails = await user.populate('uploadedImages');

      const images = req.user.uploadedImages.map(upload => upload.img);

      const imgDetails = images.flat(); // Flatten the array and extract URL

      const numberOfImgs = images.length;


      res.render('user/acct/dashboard', { userDetails, imgDetails, numberOfImgs });

    } catch (err) {
      req.flash('error', `${err.message}`);
      res.render('user/acct/dashboard');
    }
  }
  else {
    req.flash('error', 'Please login first');
    res.redirect('/login');

  }
});

router.get('/dashboard/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params;
    const user = req.user;

    const imgs = await UploadImg.findById(id).populate('user');

    res.render('user/acct/imgPreview', { imgs });
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

router.get('/upload', async (req, res) => {
  if (req.isAuthenticated()) {

    res.render('user/acct/upload');
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

router.post('/upload', upload.single('img'), async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const img = { url: req.file.path, filename: path.basename(req.file.originalname) };
      const { category, description } = req.body;
      const newImg = new UploadImg({ img, category, description, user: req.user._id });
      await newImg.save();
      req.user.uploadedImages.push(newImg._id);
      await req.user.save();
      req.flash('success', 'Image Upload Successfully');
      res.redirect('/user/upload');

    } catch (err) {
      console.log(err);
      req.flash('error', `${err.message}`);
      res.redirect('/user/upload');
    }

  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

router.get('/dashboard/:id/publish', async (req, res) => {
  if (req.isAuthenticated()) {

    try {
      const { id } = req.params;

      const imgs = await UploadImg.findById(id);

      const publishedImg = new PublishImg({ img: imgs.img, category: imgs.category, description: imgs.description, user: req.user._id });

      const getImg = await PublishImg.find({
        img: imgs.img,
        category: imgs.category,
        description: imgs.description,
        user: imgs.user
      });

      if (getImg.length) {
        req.flash('error', 'Image has already been published');
      } else {
        await publishedImg.save();
        req.flash('success', 'Image successfully published');
        console.log('Image successfully published');
      }
      res.redirect(`/user/dashboard/${id}`);

    } catch (err) {
      req.flash('error', `${err.message}`);
    }

  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});




module.exports = router;