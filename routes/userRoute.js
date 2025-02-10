const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const UploadImg = require('../models/upload');
const PublishImg = require('../models/publish');
const upload = multer({ storage });
const path = require('path');
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


    // if (!publishedImg || publishedImg.length === 0) {
    //   console.log('Published image not found');
    //   return;
    // }
    // console.log(imgs);

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

      const matchUrl = await PublishImg.find({ "img.url": publishedImg.img.url }).populate('user');

      if (!matchUrl.length) {
        await publishedImg.save();
        req.flash('success', 'Image publish successful');
      } else {
        req.flash('error', "image as already been published");
        console.log('image as already been published');
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