const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const PublishImg = require('../models/publish');
// const upload = multer({ storage });

const upload = multer({ dest: "upload" });


router.get('/dashboard', async (req, res) => {
  if (req.isAuthenticated()) {
    const publishedImages = req.user.publishedImages;
    const user = req.user;

    const userImgs = await user.populate({
      path: 'publishedImages',
      populate: {
        path: 'img'
      }
    });

    console.log(userImgs);

    const images = user.publishedImages.map(publish => publish.img);
    console.log(images);
    const imgs = images.flat().map(img => img);

    console.log(userImgs);


    res.render('user/acct/dashboard', { imgs, userImgs, publishedImages });

  }
  else {
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

router.post('/publish', upload.single('img'), async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const img = { url: req.file.path, filename: req.file.filename };
      const { category, description } = req.body;
      const newImg = new PublishImg({ img, category, description, user: req.user._id });
      await newImg.save();
      req.user.publishedImages.push(newImg._id);
      await req.user.save();
      res.redirect('/user/publish');
    }

  } catch (err) {
    console.log(err);
    req.flash('error', `${err.message}`);
    res.redirect('/user/publish');
  }
});

router.post('/publish', (req, res) => {
  if (req.isAuthenticated()) {
    // res.render('user/acct/dashboard');
    res.send(req.body);

  } else (err) => {
    req.flash('error', `${err.message}`);
    res.redirect('/dashboard');
  };
});



module.exports = router;