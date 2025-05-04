const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../../models/user");
const Wallet = require("../../models/wallet");
const {
  validateSignup,
  validateLogin,
} = require("../../validations/userValidation");

// GET Login Page
exports.getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return res.redirect("/admin/dashboard");
    }
    return res.redirect("/user/dashboard");
  }

  res.render("auth/login", {
    email: "",
    password: "",
    success: req.flash("success"),
    error: req.flash("error"),
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body);

  const renderLogin = () => {
    return res.render("auth/login", {
      email,
      password,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  };

  if (error) {
    req.flash("error", error.details[0].message);
    return renderLogin();
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // 🔐 Admin login
    if (email === adminEmail) {
      const isMatch = await bcrypt.compare(password, adminPassword);
      if (isMatch) {
        const adminUser = {
          id: "admin",
          email: adminEmail,
          username: "Admin",
          isAdmin: true,
        };

        req.login(adminUser, (err) => {
          if (err) {
            req.flash("error", "Admin login failed");
            return next(err);
          }
          req.flash("success", "Welcome back, Admin!");
          return res.redirect("/dashboard");
        });
        return;
      } else {
        req.flash("error", "Invalid admin credentials");
        return renderLogin();
      }
    }

    // 👤 Normal user login
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        req.flash("error", err.message);
        return next(err);
      }
      if (!user) {
        req.flash("error", "Invalid email or password");
        return renderLogin();
      }

      req.logIn(user, (err) => {
        if (err) {
          req.flash("error", "Login failed");
          return next(err);
        }

        req.flash("success", "Welcome back!");

        if (user.isAdmin) {
          return res.redirect("/dashboard"); // admin
        } else {
          return res.redirect("/user/dashboard"); // user
        }
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred during login");
    return renderLogin();
  }
};

// GET Signup Page
exports.getSignup = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/dashboard");
  }

  res.render("auth/signup", {
    username: "",
    email: "",
    password: "",
    success: req.flash("success"),
    error: req.flash("error"),
  });
};

// POST Signup
exports.postSignup = async (req, res) => {
  const { username, email, password } = req.body;
  const { error } = validateSignup(req.body);

  const renderSignup = () => {
    return res.render("auth/signup", {
      username,
      email,
      password,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  };

  if (error) {
    req.flash("error", error.details[0].message);
    return renderSignup();
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      req.flash("error", "Username or email already exists.");
      return renderSignup();
    }

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    const userWallet = new Wallet({ user: registeredUser._id });
    await userWallet.save();

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
    console.error("Signup error:", err);
    req.flash("error", err.message);
    return renderSignup();
  }
};

// GET Logout
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
