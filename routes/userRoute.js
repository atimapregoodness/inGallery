const express = require('express');
const router = express.Router();
const publish = require('../models/publish');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// const upload = multer({ dest: "upload" });


router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('user/acct/dashboard');
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});
router.get('/publish', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('user/acct/publish');
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    req.flash('error', 'Please upload an image');
    res.redirect('/publish');
  }
  res.send(`Image uploaded: ${req.file.path}`);
});

router.post('/pulish', (req, res) => {
  if (req.isAuthenticated()) {
    // res.render('user/acct/dashboard');
    res.send(req.body);

  } else (err) => {
    req.flash('error', `${err.message}`);
    res.redirect('/dashboard');
  };
});



module.exports = router;