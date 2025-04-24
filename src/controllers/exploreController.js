const PublishImg = require("../models/publish");
const UploadImg = require("../models/upload");
const appError = require("../utils/appError");
const Wallet = require("../models/wallet");
const { addTransaction } = require("../routes/user/services/txsService");

exports.getExplore = async (req, res) => {
  const { search } = req.query;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 30;

  if (search) {
    try {
      const imgs = await PublishImg.find({
        $or: [
          { category: new RegExp(search, "i") },
          { "img.filename": new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
        ],
      })
        .populate("user")
        .skip(skip)
        .limit(limit);
      res.render("explore", { imgs, search });
    } catch (error) {
      console.error(error);
      res.redirect("/explore");
    }
  } else {
    try {
      const imgs = await PublishImg.find({})
        .populate("user")
        .skip(skip)
        .limit(limit);
      res.render("explore", { imgs });
    } catch (error) {
      console.error(error);
      res.redirect("/explore");
    }
  }
};

exports.getImg = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 30;

    const imgs = await UploadImg.findById(id).populate("user");
    if (!imgs) {
      return next(new appError("Image not found", 404));
    }

    const findImg = await PublishImg.findById(imgs._id).populate("user");
    if (!findImg) {
      return next(new appError("Published image not found", 404));
    }

    if (user) {
      const userId = user._id.toString();
      const findImgId = findImg.user._id.toString();
      const amount = 10;
      const currency = "points";

      // Check if user is NOT the owner and has NOT already viewed the image
      if (
        userId !== findImgId &&
        !findImg.views.includes(user._id.toString())
      ) {
        // Reward the user and add them to the views list
        await addTransaction(findImg.user._id, amount, currency, "view-reward");
        findImg.views.push(user._id);

        // Save the updated image view list
        await findImg.save(); // ✅ This ensures the views array is updated in the database

        // Fetch the updated wallet with populated transactions
        const wallet = await Wallet.findOne({
          user: findImg.user._id,
        }).populate("transactions");
        console.log(wallet);
      } else {
        console.log("User has already viewed the image, no reward given.");
      }
    }

    const views = findImg.views.length;

    const findCategory = await PublishImg.find({
      $or: [
        { category: new RegExp(imgs.category, "i") },
        { "imgs.img.filename": new RegExp(imgs.filename, "i") },
        { description: new RegExp(imgs.description, "i") },
      ],
    })
      .populate("user")
      .skip(skip)
      .limit(limit);

    res.render("imgPreview", { imgs, findCategory, views });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
