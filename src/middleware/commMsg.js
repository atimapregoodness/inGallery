module.exports = async function (req, res, next) {
  if (!req.user) return next();

  const CommMsg = require("../models/commMsg"); // Ensure the model is imported here
  try {
    res.locals.commMsg = await CommMsg.find();

    console.log(res.locals.commMsg)

  } catch (err) {
    console.error(err.message);
    res.locals.commMsg = null;
  }
  next();
};
