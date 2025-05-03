module.exports = async function (req, res, next) {
  if (!req.user) return next();
  try {
    await req.user.populate("personalMsg");
    res.locals.personalMsg = req.user.personalMsg;
  } catch (err) {
    console.error("[ERROR] Failed to populate personalMsg:", err.message);
    res.locals.personalMsg = null;
  }
  next();
};
