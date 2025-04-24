// middleware/redirect.js

module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please log in to continue.");
    return res.redirect("/auth/login");
  }

  const host = req.headers.host;
  const isAdminDomain = host.startsWith("admin.");

  if (isAdminDomain && !req.user.isAdmin) {
    // User is trying to access admin dashboard without admin rights
    req.logout(() => {
      req.flash("error", "Unauthorized: Admins only.");
      return res.redirect("/auth/login");
    });
  } else if (!isAdminDomain && req.user.isAdmin) {
    // Admin is trying to access regular user dashboard
    req.logout(() => {
      req.flash("error", "Unauthorized: Users only.");
      return res.redirect("/auth/login");
    });
  } else {
    next();
  }
};
