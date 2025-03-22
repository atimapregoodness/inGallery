const User = require("../models/user");
const passport = require("passport");
const {
  validateSignup,
  validateLogin,
} = require("../validations/userValidation");
const Wallet = require("../models/wallet");
const user = require("../models/user");
// Login view
exports.getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/dashboard");
  }
  res.render("user/auth/login", {
    email: "",
    password: "",
    success: req.flash("success"),
    error: req.flash("error"),
  });
};

exports.postLogin = (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.render("user/auth/login", {
      email: req.body.email,
      password: req.body.password,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  }

  passport.authenticate(
    "local",
    { failureFlash: true, failureRedirect: "/auth/login" },
    (err, user, info) => {
      if (err) {
        req.flash("error", err.message);
        return next(err);
      }
      if (!user) {
        req.flash("error", "Invalid email or username");
        return res.render("user/auth/login", {
          email: req.body.email,
          password: req.body.password,
          success: req.flash("success"),
          error: req.flash("error"),
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          req.flash("error", "Login failed");
          return next(err);
        }
        req.flash("success", "Welcome back!");
        return res.redirect("/user/dashboard");
      });
    }
  )(req, res, next);
};

// Signup view
exports.getSignup = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/dashboard");
  }
  res.render("user/auth/signup", {
    username: "",
    email: "",
    password: "",
    success: req.flash("success"),
    error: req.flash("error"),
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { error } = validateSignup(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.render("user/auth/signup", {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    }

    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      req.flash("error", "Username or email already exists.");
      return res.render("user/auth/signup", {
        username,
        email,
        password,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    }

    try {
      // Register the new user
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);

      // Create a wallet for the user
      const userWallet = new Wallet({ user: registeredUser._id });
      await userWallet.save();

      // Log the user in automatically
      req.login(registeredUser, (err) => {
        if (err) {
          console.error("Login error:", err);
          req.flash("error", "Login failed. Please try again.");
          return res.redirect("/auth/login");
        }

        req.flash(
          "success",
          "Account successfully created! Welcome to inGallery."
        );
        return res.redirect("/user/dashboard");
      });
    } catch (err) {
      req.flash("error", err.message);
      return res.render("user/auth/signup", {
        username,
        email,
        password,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    }
  } catch (err) {
    console.error("Signup error:", err);
    req.flash("error", err.message);
    return res.render("user/auth/signup", {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  }
};

exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Error logging out");
      return res.redirect("/");
    }
    req.flash("success", "Logged out successfully");
    return res.redirect("/");
  });
};
