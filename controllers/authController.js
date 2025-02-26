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
      req.flash('error', 'Invalid credentials');
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
    const user = new User({ username, email });
    await User.register(user, password);
    req.flash('success', 'Account Created Successfully');
    res.redirect('/auth/login');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/auth/signup');
  }
};

exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error', 'Error logging out');
      res.redirect('/');
    }
  });

  req.flash('success', 'Logged out successfully');
  res.redirect('/');
};
