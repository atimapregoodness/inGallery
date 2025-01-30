const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.render('user/login');
  }
});

router.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.render('user/signup');
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const regstUser = await User.register(user, password);
    req.flash('success', 'Account Created Successfully');
    res.redirect('/login');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'Welcome back');
  res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error', 'Error logging out');
      res.redirect('/');
    }
  });

  req.flash('success', 'Logged out successfully');
  res.redirect('/');
});

module.exports = router;