const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const UploadImg = require('../models/upload');
const upload = multer({ storage });

// const upload = multer({ dest: "upload" });


router.get('/dashboard', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;

      const userDetails = await user.populate('uploadedImages');


      const images = req.user.uploadedImages.map(upload => upload.img);


      const imgDetails = images.flat(); // Flatten the array and extract URLs


      console.log(imgDetails);

      res.render('user/acct/dashboard', { userDetails, imgDetails });

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

router.get('/upload', (req, res) => {
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


      const img = { url: req.file.path, filename: req.file.filename };
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

// router.post('/publish', upload.single('img'), async (req, res) => {
//   try {
//     if (req.isAuthenticated()) {
//       const img = { url: req.file.path, filename: req.file.filename };
//       const { category, description } = req.body;
//       const newImg = new PublishImg({ img, category, description, user: req.user._id });
//       await newImg.save();
//       req.user.publishedImages.push(newImg._id);
//       await req.user.save();
//       res.redirect('/user/publish');
//     }

//   } catch (err) {
//     console.log(err);
//     req.flash('error', `${err.message}`);
//     res.redirect('/user/publish');
//   }
// });

router.post('/upload', (req, res) => {
  if (req.isAuthenticated()) {
    // res.render('user/acct/dashboard');
    res.send(req.body);

  } else (err) => {
    req.flash('error', `${err.message}`);
    res.redirect('/dashboard');
  };
});



module.exports = router;