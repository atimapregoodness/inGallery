const User = require('../models/user');
const passport = require('passport');

exports.getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/user/dashboard');
  } else {
    res.render('user/auth/login');
  }
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login' }, (err, user, info) => {
    if (err) {
      req.flash('error', err.message);
      return next(err);
    }
    if (!user) {
      req.flash('error', 'Invalid email or username');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        req.flash('error', 'Login failed');
        return next(err);
      }
      req.flash('success', 'Welcome back!');
      return res.redirect('/user/dashboard');
    });
  })(req, res, next);
};

exports.getSignup = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/user/dashboard');
  } else {
    res.render('user/auth/signup');
  }
};

exports.postSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email) {
      req.flash('error', 'Username and email are required.');
      return res.redirect('/auth/signup');
    }

    // Check if user exists with the same username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      req.flash('error', 'Username or email already exists.');
      return res.redirect('/auth/signup');
    }

    // Register new user
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to inGallery!');
      res.redirect('/user/dashbaord');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/auth/signup');
  }
};

exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error', 'Error logging out');
      return res.redirect('/');
    }
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
  });
};
